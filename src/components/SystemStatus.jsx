import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiActivity, FiAlertTriangle, FiClock } = FiIcons;

const SystemStatus = () => {
  const components = [
    { name: 'King AI Overseer', status: 'operational', uptime: '99.9%', color: 'emerald' },
    { name: 'Serf Frontend Agent', status: 'operational', uptime: '99.7%', color: 'emerald' },
    { name: 'Peasant Backend Agent', status: 'operational', uptime: '99.8%', color: 'emerald' },
    { name: 'Message Bus', status: 'operational', uptime: '100%', color: 'emerald' },
    { name: 'Data Processing', status: 'maintenance', uptime: '98.5%', color: 'yellow' },
    { name: 'Security Layer', status: 'operational', uptime: '100%', color: 'emerald' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational': return FiCheck;
      case 'maintenance': return FiClock;
      case 'warning': return FiAlertTriangle;
      default: return FiActivity;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'emerald';
      case 'maintenance': return 'yellow';
      case 'warning': return 'red';
      default: return 'blue';
    }
  };

  return (
    <div className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700">
      <h2 className="text-xl font-semibold text-white mb-6">System Status</h2>
      <div className="space-y-4">
        {components.map((component, index) => (
          <motion.div
            key={component.name}
            className="flex items-center justify-between p-3 bg-royal-700/30 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-${getStatusColor(component.status)}-500/20`}>
                <SafeIcon 
                  icon={getStatusIcon(component.status)} 
                  className={`text-sm text-${getStatusColor(component.status)}-400`} 
                />
              </div>
              <span className="text-white font-medium">{component.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-royal-300 text-sm">{component.uptime}</span>
              <span className={`px-2 py-1 text-xs font-medium rounded bg-${getStatusColor(component.status)}-500/20 text-${getStatusColor(component.status)}-400`}>
                {component.status.toUpperCase()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatus;