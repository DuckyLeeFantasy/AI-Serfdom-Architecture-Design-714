-- Multi-Agent Coordination Tables
-- Run this SQL in your Supabase SQL Editor to set up the coordination system

-- Communications table for agent messaging
CREATE TABLE IF NOT EXISTS communications_7x9k2m (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES agents_system_7x9k2m(id),
  receiver_id UUID REFERENCES agents_system_7x9k2m(id),
  message_type TEXT NOT NULL,
  content TEXT NOT NULL,
  channel TEXT DEFAULT 'default',
  priority INTEGER DEFAULT 3,
  status TEXT DEFAULT 'sent',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE
);

-- Coordination events for tracking multi-agent scenarios
CREATE TABLE IF NOT EXISTS coordination_events_7x9k2m (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coordination_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  agent_id UUID REFERENCES agents_system_7x9k2m(id)
);

-- Enhanced tasks table with coordination support
ALTER TABLE tasks_7x9k2m 
ADD COLUMN IF NOT EXISTS coordination_id TEXT,
ADD COLUMN IF NOT EXISTS execution_steps JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS result TEXT;

-- Enhanced decisions table with coordination context
ALTER TABLE decisions_7x9k2m 
ADD COLUMN IF NOT EXISTS coordination_id TEXT,
ADD COLUMN IF NOT EXISTS outcome TEXT,
ADD COLUMN IF NOT EXISTS execution_time_ms INTEGER;

-- Enhanced metrics table with coordination tracking
ALTER TABLE system_metrics_7x9k2m 
ADD COLUMN IF NOT EXISTS coordination_id TEXT,
ADD COLUMN IF NOT EXISTS scenario_type TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_communications_coordination ON communications_7x9k2m(metadata->>'coordination_id');
CREATE INDEX IF NOT EXISTS idx_coordination_events_id ON coordination_events_7x9k2m(coordination_id);
CREATE INDEX IF NOT EXISTS idx_tasks_coordination ON tasks_7x9k2m(coordination_id);
CREATE INDEX IF NOT EXISTS idx_decisions_coordination ON decisions_7x9k2m(coordination_id);
CREATE INDEX IF NOT EXISTS idx_metrics_coordination ON system_metrics_7x9k2m(coordination_id);

-- Enable Row Level Security
ALTER TABLE communications_7x9k2m ENABLE ROW LEVEL SECURITY;
ALTER TABLE coordination_events_7x9k2m ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Enable public read access on communications" ON communications_7x9k2m FOR SELECT USING (true);
CREATE POLICY "Enable public insert access on communications" ON communications_7x9k2m FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable public read access on coordination_events" ON coordination_events_7x9k2m FOR SELECT USING (true);
CREATE POLICY "Enable public insert access on coordination_events" ON coordination_events_7x9k2m FOR INSERT WITH CHECK (true);

-- Sample data for testing (optional)
INSERT INTO coordination_events_7x9k2m (coordination_id, event_type, details) VALUES
('demo_coordination_1', 'scenario_started', '{"scenario": "customer_service", "participants": ["king", "serf", "peasant"]}'),
('demo_coordination_1', 'message_sent', '{"from": "serf", "to": "king", "type": "escalation"}'),
('demo_coordination_1', 'decision_made', '{"agent": "king", "decision_type": "strategic", "confidence": 95}'),
('demo_coordination_1', 'task_assigned', '{"assignedBy": "king", "assignedTo": "peasant", "taskType": "data_analysis"}'),
('demo_coordination_1', 'scenario_completed', '{"outcome": "successful", "duration": "45s", "efficiency": 92}');