import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiAlertTriangle, FiClock, FiActivity, FiHeart, FiShield } = FiIcons;

const SystemHealth = () => {
  const healthMetrics = [
    {
      component: 'King AI Overseer',
      status: 'healthy',
      uptime: '99.9%',
      lastCheck: '2 min ago',
      issues: 0
    },
    {
      component: 'Serf Frontend Agent',
      status: 'healthy',
      uptime: '99.7%',
      lastCheck: '1 min ago',
      issues: 0
    },
    {
      component: 'Peasant Backend Agent',
      status: 'healthy',
      uptime: '99.8%',
      lastCheck: '1 min ago',
      issues: 0
    },
    {
      component: 'Database Cluster',
      status: 'warning',
      uptime: '99.2%',
      lastCheck: '3 min ago',
      issues: 1
    },
    {
      component: 'Message Queue',
      status: 'healthy',
      uptime: '100%',
      lastCheck: '1 min ago',
      issues: 0
    },
    {
      component: 'Security Layer',
      status: 'healthy',
      uptime: '100%',
      lastCheck: '2 min ago',
      issues: 0
    }
  ];

  const systemVitals = [
    { label: 'Overall Health', value: '98.5%', status: 'healthy', icon: FiHeart },
    { label: 'Security Score', value: '99.8%', status: 'healthy', icon: FiShield },
    { label: 'Performance', value: '96.2%', status: 'healthy', icon: FiActivity },
    { label: 'Availability', value: '99.7%', status: 'healthy', icon: FiCheck },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return FiCheck;
      case 'warning': return FiAlertTriangle;
      case 'critical': return FiClock;
      default: return FiActivity;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'emerald';
      case 'warning': return 'yellow';
      case 'critical': return 'red';
      default: return 'blue';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Vitals */}
      <div>
        <h4 className="text-white text-sm font-medium mb-3">System Vitals</h4>
        <div className="grid grid-cols-2 gap-3">
          {systemVitals.map((vital, index) => (
            <motion.div
              key={vital.label}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-royal-300 text-xs">{vital.label}</p>
                  <p className="text-white font-medium">{vital.value}</p>
                </div>
                <div className={`p-1 rounded bg-${getStatusColor(vital.status)}-500/20`}>
                  <SafeIcon 
                    icon={vital.icon} 
                    className={`text-sm text-${getStatusColor(vital.status)}-400`} 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Component Health */}
      <div>
        <h4 className="text-white text-sm font-medium mb-3">Component Health Status</h4>
        <div className="space-y-2">
          {healthMetrics.map((component, index) => (
            <motion.div
              key={component.component}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded bg-${getStatusColor(component.status)}-500/20`}>
                    <SafeIcon 
                      icon={getStatusIcon(component.status)} 
                      className={`text-sm text-${getStatusColor(component.status)}-400`} 
                    />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{component.component}</p>
                    <p className="text-royal-300 text-xs">Last check: {component.lastCheck}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 text-sm font-medium">{component.uptime}</p>
                  {component.issues > 0 ? (
                    <p className="text-yellow-400 text-xs">{component.issues} issue(s)</p>
                  ) : (
                    <p className="text-emerald-400 text-xs">No issues</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Health Score */}
      <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
        <h4 className="text-white text-sm font-medium mb-3">Overall Health Score</h4>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="w-full bg-royal-500 rounded-full h-3">
              <div 
                className="bg-emerald-400 h-3 rounded-full transition-all duration-500"
                style={{ width: '98.5%' }}
              ></div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400">98.5%</p>
            <p className="text-emerald-400 text-xs">Excellent</p>
          </div>
        </div>
        <p className="text-royal-300 text-xs mt-2">
          System is operating at optimal performance with minimal issues detected.
        </p>
      </div>
    </div>
  );
};

export default SystemHealth;