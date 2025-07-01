import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabaseData = () => {
  const [agents, setAgents] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch agents data
  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents_system_7x9k2m')
        .select('*')
        .order('role');

      if (error) throw error;
      setAgents(data || []);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError(err.message);
    }
  };

  // Fetch system metrics
  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('system_metrics_7x9k2m')
        .select(`
          *,
          agent:agents_system_7x9k2m(name, role)
        `)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      setMetrics(data || []);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err.message);
    }
  };

  // Fetch decisions
  const fetchDecisions = async () => {
    try {
      const { data, error } = await supabase
        .from('decisions_7x9k2m')
        .select(`
          *,
          agent:agents_system_7x9k2m(name, role)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setDecisions(data || []);
    } catch (err) {
      console.error('Error fetching decisions:', err);
      setError(err.message);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks_7x9k2m')
        .select(`
          *,
          assigned_by_agent:assigned_by(name, role),
          assigned_to_agent:assigned_to(name, role)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    }
  };

  // Fetch security events
  const fetchSecurityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('security_events_7x9k2m')
        .select(`
          *,
          agent:agents_system_7x9k2m(name, role)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSecurityEvents(data || []);
    } catch (err) {
      console.error('Error fetching security events:', err);
      setError(err.message);
    }
  };

  // Fetch workflows
  const fetchWorkflows = async () => {
    try {
      const { data, error } = await supabase
        .from('workflows_7x9k2m')
        .select(`
          *,
          creator:created_by(name, role)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setWorkflows(data || []);
    } catch (err) {
      console.error('Error fetching workflows:', err);
      setError(err.message);
    }
  };

  // Insert new metric
  const insertMetric = async (metricData) => {
    try {
      const { data, error } = await supabase
        .from('system_metrics_7x9k2m')
        .insert([metricData])
        .select();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error inserting metric:', err);
      throw err;
    }
  };

  // Insert new decision
  const insertDecision = async (decisionData) => {
    try {
      const { data, error } = await supabase
        .from('decisions_7x9k2m')
        .insert([decisionData])
        .select();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error inserting decision:', err);
      throw err;
    }
  };

  // Insert user interaction
  const logUserInteraction = async (interactionData) => {
    try {
      const { data, error } = await supabase
        .from('user_interactions_7x9k2m')
        .insert([{
          ...interactionData,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        }]);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error logging interaction:', err);
    }
  };

  // Update task progress
  const updateTaskProgress = async (taskId, progress) => {
    try {
      const { data, error } = await supabase
        .from('tasks_7x9k2m')
        .update({
          progress,
          status: progress >= 100 ? 'completed' : 'in_progress'
        })
        .eq('id', taskId)
        .select();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  // Real-time subscriptions
  useEffect(() => {
    // Subscribe to metrics changes
    const metricsSubscription = supabase
      .channel('system_metrics_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'system_metrics_7x9k2m' },
        () => {
          fetchMetrics();
        }
      )
      .subscribe();

    // Subscribe to decisions changes
    const decisionsSubscription = supabase
      .channel('decisions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'decisions_7x9k2m' },
        () => {
          fetchDecisions();
        }
      )
      .subscribe();

    // Subscribe to tasks changes
    const tasksSubscription = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks_7x9k2m' },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(metricsSubscription);
      supabase.removeChannel(decisionsSubscription);
      supabase.removeChannel(tasksSubscription);
    };
  }, []);

  // Initial data fetch
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchAgents(),
          fetchMetrics(),
          fetchDecisions(),
          fetchTasks(),
          fetchSecurityEvents(),
          fetchWorkflows()
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return {
    // Data
    agents,
    metrics,
    decisions,
    tasks,
    securityEvents,
    workflows,
    // State
    loading,
    error,
    // Actions
    insertMetric,
    insertDecision,
    logUserInteraction,
    updateTaskProgress,
    // Refresh functions
    refreshAgents: fetchAgents,
    refreshMetrics: fetchMetrics,
    refreshDecisions: fetchDecisions,
    refreshTasks: fetchTasks,
    refreshSecurityEvents: fetchSecurityEvents,
    refreshWorkflows: fetchWorkflows
  };
};