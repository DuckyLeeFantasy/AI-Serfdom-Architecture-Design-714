import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Import services and middleware
import { logger } from './src/utils/logger.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';
import { validateRequest } from './src/middleware/validation.js';
import { authenticateToken } from './src/middleware/auth.js';

// Import routes
import agentRoutes from './src/routes/agents.js';
import taskRoutes from './src/routes/tasks.js';
import coordinationRoutes from './src/routes/coordination.js';
import metricsRoutes from './src/routes/metrics.js';
import securityRoutes from './src/routes/security.js';
import governanceRoutes from './src/routes/governance.js';
import workflowRoutes from './src/routes/workflows.js';

// Import AI agents
import { KingAIAgent } from './src/agents/KingAIAgent.js';
import { SerfFrontendAgent } from './src/agents/SerfFrontendAgent.js';
import { PeasantBackendAgent } from './src/agents/PeasantBackendAgent.js';

// Import services
import { DatabaseManager } from './src/services/DatabaseManager.js';
import { MessageBroker } from './src/services/MessageBroker.js';
import { CoordinationEngine } from './src/services/CoordinationEngine.js';
import { SecurityManager } from './src/services/SecurityManager.js';
import { MetricsCollector } from './src/services/MetricsCollector.js';
import { TaskScheduler } from './src/services/TaskScheduler.js';

// Load environment variables
dotenv.config();

class AISerfdomServer {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' ? false : "*",
        methods: ["GET", "POST"]
      }
    });
    
    this.port = process.env.PORT || 5000;
    this.host = process.env.HOST || 'localhost';
    
    // Initialize services
    this.initializeServices();
    
    // Initialize agents
    this.initializeAgents();
    
    // Setup middleware
    this.setupMiddleware();
    
    // Setup routes
    this.setupRoutes();
    
    // Setup WebSocket handlers
    this.setupWebSocket();
    
    // Setup error handling
    this.setupErrorHandling();
  }

  async initializeServices() {
    try {
      // Initialize database
      this.database = new DatabaseManager();
      await this.database.initialize();
      
      // Initialize message broker
      this.messageBroker = new MessageBroker();
      await this.messageBroker.connect();
      
      // Initialize coordination engine
      this.coordinationEngine = new CoordinationEngine(this.messageBroker);
      
      // Initialize security manager
      this.securityManager = new SecurityManager();
      
      // Initialize metrics collector
      this.metricsCollector = new MetricsCollector();
      
      // Initialize task scheduler
      this.taskScheduler = new TaskScheduler();
      await this.taskScheduler.start();
      
      logger.info('All services initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize services:', error);
      process.exit(1);
    }
  }

  initializeAgents() {
    try {
      // Initialize AI agents
      this.kingAgent = new KingAIAgent({
        coordinationEngine: this.coordinationEngine,
        database: this.database,
        messageBroker: this.messageBroker
      });
      
      this.serfAgent = new SerfFrontendAgent({
        coordinationEngine: this.coordinationEngine,
        database: this.database,
        messageBroker: this.messageBroker
      });
      
      this.peasantAgent = new PeasantBackendAgent({
        coordinationEngine: this.coordinationEngine,
        database: this.database,
        messageBroker: this.messageBroker
      });
      
      // Start agents
      this.kingAgent.start();
      this.serfAgent.start();
      this.peasantAgent.start();
      
      logger.info('All AI agents initialized and started');
    } catch (error) {
      logger.error('Failed to initialize agents:', error);
      throw error;
    }
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' ? 
        process.env.ALLOWED_ORIGINS?.split(',') : true,
      credentials: true
    }));
    
    // Compression
    this.app.use(compression());
    
    // Logging
    this.app.use(morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) }
    }));
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs
      message: 'Too many requests from this IP',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);
    
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Add services to request object
    this.app.use((req, res, next) => {
      req.services = {
        database: this.database,
        messageBroker: this.messageBroker,
        coordinationEngine: this.coordinationEngine,
        securityManager: this.securityManager,
        metricsCollector: this.metricsCollector,
        taskScheduler: this.taskScheduler,
        agents: {
          king: this.kingAgent,
          serf: this.serfAgent,
          peasant: this.peasantAgent
        }
      };
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: this.database.isConnected(),
          messageBroker: this.messageBroker.isConnected(),
          agents: {
            king: this.kingAgent.isActive(),
            serf: this.serfAgent.isActive(),
            peasant: this.peasantAgent.isActive()
          }
        }
      });
    });

    // API routes
    this.app.use('/api/agents', agentRoutes);
    this.app.use('/api/tasks', taskRoutes);
    this.app.use('/api/coordination', coordinationRoutes);
    this.app.use('/api/metrics', metricsRoutes);
    this.app.use('/api/security', securityRoutes);
    this.app.use('/api/governance', governanceRoutes);
    this.app.use('/api/workflows', workflowRoutes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        name: 'AI-Serfdom Backend System',
        version: '1.0.0',
        description: 'Comprehensive multi-agent AI coordination backend',
        endpoints: {
          health: '/health',
          agents: '/api/agents',
          tasks: '/api/tasks',
          coordination: '/api/coordination',
          metrics: '/api/metrics',
          security: '/api/security',
          governance: '/api/governance',
          workflows: '/api/workflows'
        }
      });
    });
  }

  setupWebSocket() {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      // Join agent-specific rooms
      socket.on('join-agent-room', (agentType) => {
        socket.join(`agent-${agentType}`);
        logger.info(`Socket ${socket.id} joined agent-${agentType} room`);
      });

      // Handle coordination requests
      socket.on('coordination-request', async (data) => {
        try {
          const result = await this.coordinationEngine.handleCoordinationRequest(data);
          socket.emit('coordination-response', result);
          
          // Broadcast to relevant agents
          if (data.targetAgents) {
            data.targetAgents.forEach(agentType => {
              this.io.to(`agent-${agentType}`).emit('coordination-update', result);
            });
          }
        } catch (error) {
          logger.error('Coordination request failed:', error);
          socket.emit('coordination-error', { error: error.message });
        }
      });

      // Handle agent messages
      socket.on('agent-message', async (data) => {
        try {
          await this.messageBroker.publish(`agent.${data.targetAgent}`, data);
          socket.emit('message-sent', { success: true });
        } catch (error) {
          logger.error('Agent message failed:', error);
          socket.emit('message-error', { error: error.message });
        }
      });

      // Handle task execution
      socket.on('execute-task', async (taskData) => {
        try {
          const result = await this.coordinationEngine.executeTask(taskData);
          socket.emit('task-result', result);
        } catch (error) {
          logger.error('Task execution failed:', error);
          socket.emit('task-error', { error: error.message });
        }
      });

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });

    // Setup agent event broadcasting
    this.setupAgentEventBroadcasting();
  }

  setupAgentEventBroadcasting() {
    // King Agent events
    this.kingAgent.on('decision-made', (decision) => {
      this.io.emit('king-decision', decision);
    });

    this.kingAgent.on('task-delegated', (delegation) => {
      this.io.emit('task-delegation', delegation);
    });

    // Serf Agent events
    this.serfAgent.on('user-interaction', (interaction) => {
      this.io.emit('user-interaction', interaction);
    });

    this.serfAgent.on('interface-update', (update) => {
      this.io.emit('interface-update', update);
    });

    // Peasant Agent events
    this.peasantAgent.on('data-processed', (result) => {
      this.io.emit('data-processing', result);
    });

    this.peasantAgent.on('workflow-completed', (workflow) => {
      this.io.emit('workflow-completed', workflow);
    });

    // Coordination Engine events
    this.coordinationEngine.on('coordination-started', (coordination) => {
      this.io.emit('coordination-started', coordination);
    });

    this.coordinationEngine.on('coordination-completed', (result) => {
      this.io.emit('coordination-completed', result);
    });
  }

  setupErrorHandling() {
    // 404 handler
    this.app.use(notFoundHandler);
    
    // Error handler
    this.app.use(errorHandler);
    
    // Graceful shutdown
    process.on('SIGTERM', () => this.gracefulShutdown());
    process.on('SIGINT', () => this.gracefulShutdown());
  }

  async gracefulShutdown() {
    logger.info('Received shutdown signal, closing server...');
    
    this.server.close(async () => {
      logger.info('HTTP server closed');
      
      try {
        // Stop agents
        await this.kingAgent.stop();
        await this.serfAgent.stop();
        await this.peasantAgent.stop();
        
        // Stop services
        await this.taskScheduler.stop();
        await this.messageBroker.disconnect();
        await this.database.close();
        
        logger.info('All services stopped gracefully');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    });
  }

  start() {
    this.server.listen(this.port, this.host, () => {
      logger.info(`AI-Serfdom Backend Server running on http://${this.host}:${this.port}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      
      // Log service status
      logger.info('Service Status:');
      logger.info(`- Database: ${this.database.isConnected() ? 'Connected' : 'Disconnected'}`);
      logger.info(`- Message Broker: ${this.messageBroker.isConnected() ? 'Connected' : 'Disconnected'}`);
      logger.info(`- King Agent: ${this.kingAgent.isActive() ? 'Active' : 'Inactive'}`);
      logger.info(`- Serf Agent: ${this.serfAgent.isActive() ? 'Active' : 'Inactive'}`);
      logger.info(`- Peasant Agent: ${this.peasantAgent.isActive() ? 'Active' : 'Inactive'}`);
    });
  }
}

// Start the server
const server = new AISerfdomServer();
server.start();

export default AISerfdomServer;