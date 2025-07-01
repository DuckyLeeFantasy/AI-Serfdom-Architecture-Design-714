import Database from 'better-sqlite3';
import { logger } from '../utils/logger.js';
import fs from 'fs/promises';
import path from 'path';

export class DatabaseManager {
  constructor() {
    this.dbPath = process.env.DATABASE_URL?.replace('sqlite:', '') || './data/ai-serfdom.db';
    this.db = null;
    this.isConnectedFlag = false;
  }

  async initialize() {
    try {
      // Ensure data directory exists
      const dbDir = path.dirname(this.dbPath);
      await fs.mkdir(dbDir, { recursive: true });

      // Initialize SQLite database
      this.db = new Database(this.dbPath);
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('foreign_keys = ON');
      
      // Create tables
      await this.createTables();
      
      this.isConnectedFlag = true;
      logger.info('Database initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async createTables() {
    const schema = `
      -- Agents table
      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        capabilities TEXT, -- JSON string
        configuration TEXT, -- JSON string
        metrics TEXT, -- JSON string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Tasks table
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        priority INTEGER DEFAULT 3,
        status TEXT DEFAULT 'pending',
        assigned_by TEXT,
        assigned_to TEXT,
        parent_task_id TEXT,
        coordination_id TEXT,
        metadata TEXT, -- JSON string
        execution_steps TEXT, -- JSON string
        progress INTEGER DEFAULT 0,
        result TEXT, -- JSON string
        error_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        started_at DATETIME,
        completed_at DATETIME,
        FOREIGN KEY (assigned_by) REFERENCES agents(id),
        FOREIGN KEY (assigned_to) REFERENCES agents(id),
        FOREIGN KEY (parent_task_id) REFERENCES tasks(id)
      );

      -- Communications table
      CREATE TABLE IF NOT EXISTS communications (
        id TEXT PRIMARY KEY,
        sender_id TEXT NOT NULL,
        receiver_id TEXT NOT NULL,
        message_type TEXT NOT NULL,
        channel TEXT DEFAULT 'default',
        priority INTEGER DEFAULT 3,
        content TEXT NOT NULL,
        metadata TEXT, -- JSON string
        status TEXT DEFAULT 'sent',
        coordination_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        delivered_at DATETIME,
        read_at DATETIME,
        FOREIGN KEY (sender_id) REFERENCES agents(id),
        FOREIGN KEY (receiver_id) REFERENCES agents(id)
      );

      -- Decisions table
      CREATE TABLE IF NOT EXISTS decisions (
        id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        decision_type TEXT NOT NULL,
        description TEXT NOT NULL,
        reasoning TEXT,
        context TEXT, -- JSON string
        confidence_score REAL,
        alternatives TEXT, -- JSON string
        impact_assessment TEXT, -- JSON string
        status TEXT DEFAULT 'pending',
        coordination_id TEXT,
        outcome TEXT,
        execution_time_ms INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        executed_at DATETIME,
        FOREIGN KEY (agent_id) REFERENCES agents(id)
      );

      -- Metrics table
      CREATE TABLE IF NOT EXISTS metrics (
        id TEXT PRIMARY KEY,
        agent_id TEXT,
        metric_type TEXT NOT NULL,
        metric_name TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT,
        tags TEXT, -- JSON string
        metadata TEXT, -- JSON string
        coordination_id TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (agent_id) REFERENCES agents(id)
      );

      -- Workflows table
      CREATE TABLE IF NOT EXISTS workflows (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        definition TEXT NOT NULL, -- JSON string
        status TEXT DEFAULT 'draft',
        created_by TEXT,
        current_stage TEXT,
        progress INTEGER DEFAULT 0,
        execution_log TEXT, -- JSON string
        coordination_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        started_at DATETIME,
        completed_at DATETIME,
        FOREIGN KEY (created_by) REFERENCES agents(id)
      );

      -- Coordination sessions table
      CREATE TABLE IF NOT EXISTS coordination_sessions (
        id TEXT PRIMARY KEY,
        scenario_id TEXT NOT NULL,
        participants TEXT NOT NULL, -- JSON array
        status TEXT DEFAULT 'active',
        metadata TEXT, -- JSON string
        metrics TEXT, -- JSON string
        outcome TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME
      );

      -- Security events table
      CREATE TABLE IF NOT EXISTS security_events (
        id TEXT PRIMARY KEY,
        event_type TEXT NOT NULL,
        severity TEXT NOT NULL,
        agent_id TEXT,
        description TEXT NOT NULL,
        details TEXT, -- JSON string
        source_ip TEXT,
        user_agent TEXT,
        resolved BOOLEAN DEFAULT FALSE,
        resolution_notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        resolved_at DATETIME,
        FOREIGN KEY (agent_id) REFERENCES agents(id)
      );

      -- Audit logs table
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        action TEXT NOT NULL,
        actor_id TEXT,
        actor_type TEXT,
        changes TEXT, -- JSON string
        metadata TEXT, -- JSON string
        ip_address TEXT,
        user_agent TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (actor_id) REFERENCES agents(id)
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
      CREATE INDEX IF NOT EXISTS idx_tasks_coordination ON tasks(coordination_id);
      CREATE INDEX IF NOT EXISTS idx_communications_coordination ON communications(coordination_id);
      CREATE INDEX IF NOT EXISTS idx_decisions_agent ON decisions(agent_id);
      CREATE INDEX IF NOT EXISTS idx_metrics_agent ON metrics(agent_id);
      CREATE INDEX IF NOT EXISTS idx_metrics_timestamp ON metrics(timestamp);
      CREATE INDEX IF NOT EXISTS idx_security_events_timestamp ON security_events(created_at);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
    `;

    this.db.exec(schema);
  }

  // Generic CRUD operations
  insert(table, data) {
    try {
      const keys = Object.keys(data);
      const placeholders = keys.map(() => '?').join(',');
      const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;
      
      const stmt = this.db.prepare(sql);
      return stmt.run(...Object.values(data));
    } catch (error) {
      logger.error(`Error inserting into ${table}:`, error);
      throw error;
    }
  }

  select(table, conditions = {}, options = {}) {
    try {
      let sql = `SELECT * FROM ${table}`;
      const values = [];

      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions)
          .map(key => `${key} = ?`)
          .join(' AND ');
        sql += ` WHERE ${whereClause}`;
        values.push(...Object.values(conditions));
      }

      if (options.orderBy) {
        sql += ` ORDER BY ${options.orderBy}`;
      }

      if (options.limit) {
        sql += ` LIMIT ${options.limit}`;
      }

      if (options.offset) {
        sql += ` OFFSET ${options.offset}`;
      }

      const stmt = this.db.prepare(sql);
      return options.single ? stmt.get(...values) : stmt.all(...values);
    } catch (error) {
      logger.error(`Error selecting from ${table}:`, error);
      throw error;
    }
  }

  update(table, data, conditions) {
    try {
      const setClause = Object.keys(data)
        .map(key => `${key} = ?`)
        .join(', ');
      
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');

      const sql = `UPDATE ${table} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE ${whereClause}`;
      const values = [...Object.values(data), ...Object.values(conditions)];

      const stmt = this.db.prepare(sql);
      return stmt.run(...values);
    } catch (error) {
      logger.error(`Error updating ${table}:`, error);
      throw error;
    }
  }

  delete(table, conditions) {
    try {
      const whereClause = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');

      const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
      const stmt = this.db.prepare(sql);
      return stmt.run(...Object.values(conditions));
    } catch (error) {
      logger.error(`Error deleting from ${table}:`, error);
      throw error;
    }
  }

  // Agent-specific methods
  async createAgent(agentData) {
    const agent = {
      id: agentData.id,
      name: agentData.name,
      type: agentData.type,
      role: agentData.role,
      status: agentData.status || 'active',
      capabilities: JSON.stringify(agentData.capabilities || []),
      configuration: JSON.stringify(agentData.configuration || {}),
      metrics: JSON.stringify(agentData.metrics || {})
    };

    this.insert('agents', agent);
    return this.getAgent(agent.id);
  }

  getAgent(id) {
    const agent = this.select('agents', { id }, { single: true });
    if (agent) {
      agent.capabilities = JSON.parse(agent.capabilities || '[]');
      agent.configuration = JSON.parse(agent.configuration || '{}');
      agent.metrics = JSON.parse(agent.metrics || '{}');
    }
    return agent;
  }

  getAllAgents() {
    const agents = this.select('agents');
    return agents.map(agent => {
      agent.capabilities = JSON.parse(agent.capabilities || '[]');
      agent.configuration = JSON.parse(agent.configuration || '{}');
      agent.metrics = JSON.parse(agent.metrics || '{}');
      return agent;
    });
  }

  // Task-specific methods
  async createTask(taskData) {
    const task = {
      id: taskData.id,
      title: taskData.title,
      description: taskData.description,
      type: taskData.type,
      priority: taskData.priority || 3,
      status: taskData.status || 'pending',
      assigned_by: taskData.assigned_by,
      assigned_to: taskData.assigned_to,
      parent_task_id: taskData.parent_task_id,
      coordination_id: taskData.coordination_id,
      metadata: JSON.stringify(taskData.metadata || {}),
      execution_steps: JSON.stringify(taskData.execution_steps || [])
    };

    this.insert('tasks', task);
    return this.getTask(task.id);
  }

  getTask(id) {
    const task = this.select('tasks', { id }, { single: true });
    if (task) {
      task.metadata = JSON.parse(task.metadata || '{}');
      task.execution_steps = JSON.parse(task.execution_steps || '[]');
      if (task.result) task.result = JSON.parse(task.result);
    }
    return task;
  }

  updateTaskProgress(id, progress, status = null) {
    const updates = { progress };
    if (status) updates.status = status;
    if (status === 'in_progress' && !this.getTask(id).started_at) {
      updates.started_at = new Date().toISOString();
    }
    if (status === 'completed' || status === 'failed') {
      updates.completed_at = new Date().toISOString();
    }
    
    return this.update('tasks', updates, { id });
  }

  // Metrics methods
  async recordMetric(metricData) {
    const metric = {
      id: metricData.id,
      agent_id: metricData.agent_id,
      metric_type: metricData.metric_type,
      metric_name: metricData.metric_name,
      value: metricData.value,
      unit: metricData.unit,
      tags: JSON.stringify(metricData.tags || {}),
      metadata: JSON.stringify(metricData.metadata || {}),
      coordination_id: metricData.coordination_id
    };

    return this.insert('metrics', metric);
  }

  getMetrics(filters = {}, options = {}) {
    const metrics = this.select('metrics', filters, options);
    return metrics.map(metric => {
      metric.tags = JSON.parse(metric.tags || '{}');
      metric.metadata = JSON.parse(metric.metadata || '{}');
      return metric;
    });
  }

  // Communication methods
  async recordCommunication(commData) {
    const communication = {
      id: commData.id,
      sender_id: commData.sender_id,
      receiver_id: commData.receiver_id,
      message_type: commData.message_type,
      channel: commData.channel || 'default',
      priority: commData.priority || 3,
      content: commData.content,
      metadata: JSON.stringify(commData.metadata || {}),
      coordination_id: commData.coordination_id
    };

    return this.insert('communications', communication);
  }

  getCommunications(filters = {}, options = {}) {
    const communications = this.select('communications', filters, options);
    return communications.map(comm => {
      comm.metadata = JSON.parse(comm.metadata || '{}');
      return comm;
    });
  }

  // Transaction support
  transaction(fn) {
    return this.db.transaction(fn)();
  }

  isConnected() {
    return this.isConnectedFlag;
  }

  async close() {
    if (this.db) {
      this.db.close();
      this.isConnectedFlag = false;
      logger.info('Database connection closed');
    }
  }
}

export default DatabaseManager;