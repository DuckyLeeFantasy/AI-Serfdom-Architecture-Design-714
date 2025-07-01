import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSupabaseData } from '../hooks/useSupabaseData';

const { FiDatabase, FiActivity, FiTrendingUp, FiRefreshCw } = FiIcons;

const LiveDataDisplay = () => {
  const {
    agents,
    metrics,
    decisions,
    tasks,
    securityEvents,
    loading,
    error,
    logUserInteraction
  } = useSupabaseData();

  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Log page view
    logUserInteraction({
      interaction_type: 'page_view',
      page_path: '/live-data',
      data: { component: 'LiveDataDisplay' }
    });
  }, [logUserInteraction]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <SafeIcon icon={FiRefreshCw} className="animate-spin text-2xl text-royal-400" />
        <span className="ml-2 text-royal-300">Loading live data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-400">Error loading data: {error}</p>
      </div>
    );
  }

  const getLatestMetrics = () => {
    const latest = {};
    metrics.forEach(metric => {
      const key = `${metric.agent?.role || 'system'}_${metric.metric_type}`;
      if (!latest[key] || new Date(metric.timestamp) > new Date(latest[key].timestamp)) {
        latest[key] = metric;
      }
    });
    return Object.values(latest);
  };

  const latestMetrics = getLatestMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiDatabase} className="text-2xl text-emerald-400" />
          <div>
            <h2 className="text-xl font-semibold text-white">Live System Data</h2>
            <p className="text-royal-300 text-sm">Real-time data from Supabase backend</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-royal-400 text-xs">Last updated</p>
          <p className="text-white text-sm">{lastUpdate.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Agents Status */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Active Agents</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  agent.status === 'active' ? 'bg-emerald-400 animate-pulse' :
                  agent.status === 'maintenance' ? 'bg-yellow-400' :
                  'bg-red-400'
                }`}></div>
                <div>
                  <h4 className="text-white font-medium">{agent.name}</h4>
                  <p className="text-royal-300 text-sm capitalize">{agent.role} • {agent.status}</p>
                </div>
              </div>
              {agent.metrics && (
                <div className="mt-3 text-xs">
                  {Object.entries(agent.metrics).slice(0, 2).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-royal-400 capitalize">{key.replace('_', ' ')}:</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Live Metrics */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Live System Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {latestMetrics.slice(0, 8).map((metric, index) => (
            <motion.div
              key={`${metric.agent_id}_${metric.metric_type}`}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-2">
                <SafeIcon icon={FiActivity} className="text-blue-400" />
                <span className="text-royal-300 text-xs">
                  {metric.agent?.role || 'system'}
                </span>
              </div>
              <h4 className="text-white text-sm font-medium capitalize">
                {metric.metric_type.replace('_', ' ')}
              </h4>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-bold text-emerald-400">
                  {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}
                </span>
                {metric.unit && (
                  <span className="text-royal-400 text-xs">{metric.unit}</span>
                )}
              </div>
              <p className="text-royal-400 text-xs mt-1">
                {new Date(metric.timestamp).toLocaleTimeString()}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Decisions */}
      {decisions.length > 0 && (
        <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Decisions</h3>
          <div className="space-y-3">
            {decisions.slice(0, 3).map((decision, index) => (
              <motion.div
                key={decision.id}
                className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 text-xs font-medium bg-gold-500/20 text-gold-400 rounded">
                    {decision.decision_type.replace('_', ' ').toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-emerald-400 text-sm">{decision.confidence_score}%</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      decision.status === 'executed' ? 'bg-emerald-500/20 text-emerald-400' :
                      decision.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {decision.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <h4 className="text-white font-medium">{decision.description}</h4>
                <p className="text-royal-300 text-sm mt-1">{decision.reasoning}</p>
                {decision.outcome && (
                  <p className="text-emerald-400 text-sm mt-1">Outcome: {decision.outcome}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Active Tasks */}
      {tasks.length > 0 && (
        <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
          <h3 className="text-lg font-semibold text-white mb-4">Active Tasks</h3>
          <div className="space-y-3">
            {tasks.filter(task => task.status !== 'completed').slice(0, 4).map((task, index) => (
              <motion.div
                key={task.id}
                className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{task.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                    task.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-royal-300 text-sm mb-2">{task.description}</p>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-royal-500 rounded-full h-2">
                    <div 
                      className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-white text-sm">{task.progress}%</span>
                </div>
                <div className="flex justify-between text-xs text-royal-400 mt-2">
                  <span>Priority: {task.priority}/5</span>
                  <span>Assigned to: {task.assigned_to_agent?.name || 'Unknown'}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Security Events */}
      {securityEvents.length > 0 && (
        <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
          <h3 className="text-lg font-semibold text-white mb-4">Security Events</h3>
          <div className="space-y-3">
            {securityEvents.slice(0, 3).map((event, index) => (
              <motion.div
                key={event.id}
                className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      event.severity === 'low' ? 'bg-green-400' :
                      event.severity === 'medium' ? 'bg-yellow-400' :
                      event.severity === 'high' ? 'bg-orange-400' :
                      'bg-red-400'
                    }`}></div>
                    <span className="text-white font-medium">{event.event_type.replace('_', ' ')}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    event.resolved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {event.resolved ? 'RESOLVED' : 'ACTIVE'}
                  </span>
                </div>
                <p className="text-royal-300 text-sm">{event.description}</p>
                <p className="text-royal-400 text-xs mt-1">
                  {new Date(event.created_at).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveDataDisplay;