import EventEmitter from 'events';
import Redis from 'ioredis';
import { logger } from '../utils/logger.js';

export class MessageBroker extends EventEmitter {
  constructor() {
    super();
    this.redis = null;
    this.subscriber = null;
    this.publisher = null;
    this.isConnectedFlag = false;
    this.subscriptions = new Map();
  }

  async connect() {
    try {
      const redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        db: process.env.REDIS_DB || 0,
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: null
      };

      // Create Redis instances for pub/sub
      this.publisher = new Redis(redisConfig);
      this.subscriber = new Redis(redisConfig);
      this.redis = new Redis(redisConfig);

      // Set up event handlers
      this.publisher.on('connect', () => {
        logger.info('Redis publisher connected');
      });

      this.subscriber.on('connect', () => {
        logger.info('Redis subscriber connected');
      });

      this.redis.on('connect', () => {
        logger.info('Redis client connected');
        this.isConnectedFlag = true;
      });

      this.publisher.on('error', (error) => {
        logger.error('Redis publisher error:', error);
      });

      this.subscriber.on('error', (error) => {
        logger.error('Redis subscriber error:', error);
      });

      this.redis.on('error', (error) => {
        logger.error('Redis client error:', error);
        this.isConnectedFlag = false;
      });

      // Set up message handling
      this.subscriber.on('message', (channel, message) => {
        this.handleMessage(channel, message);
      });

      logger.info('Message broker connected successfully');
    } catch (error) {
      logger.error('Failed to connect message broker:', error);
      throw error;
    }
  }

  async publish(channel, data, options = {}) {
    try {
      const message = JSON.stringify({
        id: options.id || this.generateId(),
        timestamp: new Date().toISOString(),
        type: options.type || 'message',
        data,
        metadata: options.metadata || {}
      });

      await this.publisher.publish(channel, message);
      
      logger.debug(`Message published to ${channel}:`, { messageId: options.id });
      
      return true;
    } catch (error) {
      logger.error(`Failed to publish message to ${channel}:`, error);
      throw error;
    }
  }

  async subscribe(channel, handler) {
    try {
      await this.subscriber.subscribe(channel);
      this.subscriptions.set(channel, handler);
      
      logger.info(`Subscribed to channel: ${channel}`);
      
      return true;
    } catch (error) {
      logger.error(`Failed to subscribe to ${channel}:`, error);
      throw error;
    }
  }

  async unsubscribe(channel) {
    try {
      await this.subscriber.unsubscribe(channel);
      this.subscriptions.delete(channel);
      
      logger.info(`Unsubscribed from channel: ${channel}`);
      
      return true;
    } catch (error) {
      logger.error(`Failed to unsubscribe from ${channel}:`, error);
      throw error;
    }
  }

  handleMessage(channel, message) {
    try {
      const parsedMessage = JSON.parse(message);
      const handler = this.subscriptions.get(channel);
      
      if (handler) {
        handler(parsedMessage, channel);
      } else {
        // Emit the message as an event
        this.emit('message', {
          channel,
          message: parsedMessage
        });
      }
    } catch (error) {
      logger.error(`Failed to handle message on ${channel}:`, error);
    }
  }

  // Queue operations using Redis lists
  async enqueue(queueName, data, options = {}) {
    try {
      const message = JSON.stringify({
        id: options.id || this.generateId(),
        timestamp: new Date().toISOString(),
        priority: options.priority || 3,
        data,
        metadata: options.metadata || {}
      });

      const operation = options.priority > 5 ? 'lpush' : 'rpush';
      await this.redis[operation](queueName, message);
      
      logger.debug(`Message enqueued to ${queueName}:`, { messageId: options.id });
      
      return true;
    } catch (error) {
      logger.error(`Failed to enqueue message to ${queueName}:`, error);
      throw error;
    }
  }

  async dequeue(queueName, timeout = 0) {
    try {
      const result = await this.redis.blpop(queueName, timeout);
      
      if (result) {
        const [queue, message] = result;
        return JSON.parse(message);
      }
      
      return null;
    } catch (error) {
      logger.error(`Failed to dequeue message from ${queueName}:`, error);
      throw error;
    }
  }

  async getQueueLength(queueName) {
    try {
      return await this.redis.llen(queueName);
    } catch (error) {
      logger.error(`Failed to get queue length for ${queueName}:`, error);
      throw error;
    }
  }

  // Cache operations
  async set(key, value, expiration = null) {
    try {
      const serializedValue = JSON.stringify(value);
      
      if (expiration) {
        await this.redis.setex(key, expiration, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
      
      return true;
    } catch (error) {
      logger.error(`Failed to set cache key ${key}:`, error);
      throw error;
    }
  }

  async get(key) {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Failed to get cache key ${key}:`, error);
      throw error;
    }
  }

  async delete(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      logger.error(`Failed to delete cache key ${key}:`, error);
      throw error;
    }
  }

  // Pattern-based operations
  async publishToPattern(pattern, data, options = {}) {
    try {
      const channels = await this.getChannelsByPattern(pattern);
      
      const publishPromises = channels.map(channel => 
        this.publish(channel, data, options)
      );
      
      await Promise.all(publishPromises);
      
      return channels.length;
    } catch (error) {
      logger.error(`Failed to publish to pattern ${pattern}:`, error);
      throw error;
    }
  }

  async getChannelsByPattern(pattern) {
    try {
      return await this.redis.pubsub('channels', pattern);
    } catch (error) {
      logger.error(`Failed to get channels by pattern ${pattern}:`, error);
      return [];
    }
  }

  // Agent-specific convenience methods
  async sendToAgent(agentType, message, options = {}) {
    const channel = `agent.${agentType}`;
    return this.publish(channel, message, {
      ...options,
      type: 'agent_message'
    });
  }

  async broadcastToAllAgents(message, options = {}) {
    return this.publishToPattern('agent.*', message, {
      ...options,
      type: 'broadcast'
    });
  }

  async subscribeToAgent(agentType, handler) {
    const channel = `agent.${agentType}`;
    return this.subscribe(channel, handler);
  }

  // Coordination-specific methods
  async publishCoordinationEvent(coordinationId, event, data) {
    const channel = `coordination.${coordinationId}`;
    return this.publish(channel, {
      event,
      data,
      coordinationId
    }, {
      type: 'coordination_event'
    });
  }

  async subscribeToCoordination(coordinationId, handler) {
    const channel = `coordination.${coordinationId}`;
    return this.subscribe(channel, handler);
  }

  // Utility methods
  generateId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  isConnected() {
    return this.isConnectedFlag;
  }

  async disconnect() {
    try {
      if (this.publisher) {
        await this.publisher.quit();
      }
      
      if (this.subscriber) {
        await this.subscriber.quit();
      }
      
      if (this.redis) {
        await this.redis.quit();
      }
      
      this.isConnectedFlag = false;
      logger.info('Message broker disconnected');
    } catch (error) {
      logger.error('Error disconnecting message broker:', error);
    }
  }
}

export default MessageBroker;