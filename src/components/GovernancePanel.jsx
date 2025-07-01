import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiShield, FiEye, FiFileText, FiUsers, FiLock, FiCheckCircle } = FiIcons;

const GovernancePanel = () => {
  const governanceMetrics = [
    { label: 'Compliance Score', value: '98.5%', icon: FiShield, color: 'emerald' },
    { label: 'Audit Events', value: '1,247', icon: FiEye, color: 'blue' },
    { label: 'Policy Violations', value: '0', icon: FiLock, color: 'green' },
    { label: 'Access Reviews', value: '15', icon: FiUsers, color: 'gold' },
  ];

  const policies = [
    {
      id: 1,
      name: 'Data Privacy Protection',
      status: 'active',
      compliance: 100,
      lastReview: '2024-01-15',
      violations: 0
    },
    {
      id: 2,
      name: 'Resource Access Control',
      status: 'active',
      compliance: 98,
      lastReview: '2024-01-10',
      violations: 0
    },
    {
      id: 3,
      name: 'Decision Transparency',
      status: 'active',
      compliance: 99,
      lastReview: '2024-01-12',
      violations: 0
    },
    {
      id: 4,
      name: 'Audit Trail Maintenance',
      status: 'review',
      compliance: 95,
      lastReview: '2024-01-08',
      violations: 1
    },
  ];

  const auditLog = [
    {
      id: 1,
      event: 'Resource allocation decision',
      agent: 'King AI Overseer',
      timestamp: '2024-01-15 14:30:22',
      outcome: 'approved',
      details: 'Allocated 25% additional CPU to backend processing'
    },
    {
      id: 2,
      event: 'Policy compliance check',
      agent: 'System Monitor',
      timestamp: '2024-01-15 14:25:15',
      outcome: 'passed',
      details: 'All agents comply with data privacy requirements'
    },
    {
      id: 3,
      event: 'Access permission granted',
      agent: 'Security Module',
      timestamp: '2024-01-15 14:20:08',
      outcome: 'approved',
      details: 'Frontend agent granted access to user analytics data'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Governance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {governanceMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="bg-royal-700/30 rounded-lg p-4 border border-royal-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-royal-400 text-sm">{metric.label}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
              </div>
              <div className={`p-2 rounded-lg bg-${metric.color}-500/20`}>
                <SafeIcon icon={metric.icon} className={`text-lg text-${metric.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Policy Management */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiFileText} className="text-gold-400" />
          <span>Policy Management</span>
        </h3>
        
        <div className="space-y-3">
          {policies.map((policy, index) => (
            <motion.div
              key={policy.id}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{policy.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    policy.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    policy.status === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {policy.status.toUpperCase()}
                  </span>
                  {policy.violations === 0 && (
                    <SafeIcon icon={FiCheckCircle} className="text-emerald-400 text-sm" />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-royal-300">Compliance</p>
                  <p className="text-white font-medium">{policy.compliance}%</p>
                </div>
                <div>
                  <p className="text-royal-300">Last Review</p>
                  <p className="text-white font-medium">{policy.lastReview}</p>
                </div>
                <div>
                  <p className="text-royal-300">Violations</p>
                  <p className={`font-medium ${
                    policy.violations === 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {policy.violations}
                  </p>
                </div>
              </div>
              
              <div className="mt-2 w-full bg-royal-500 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    policy.compliance >= 98 ? 'bg-emerald-400' :
                    policy.compliance >= 90 ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`}
                  style={{ width: `${policy.compliance}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiEye} className="text-blue-400" />
          <span>Recent Audit Events</span>
        </h3>
        
        <div className="space-y-3">
          {auditLog.map((event, index) => (
            <motion.div
              key={event.id}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{event.event}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-royal-300 text-sm">{event.agent}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    event.outcome === 'approved' || event.outcome === 'passed' ? 
                    'bg-emerald-500/20 text-emerald-400' :
                    event.outcome === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {event.outcome.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <p className="text-royal-300 text-sm mb-1">{event.details}</p>
              <p className="text-royal-400 text-xs">{event.timestamp}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GovernancePanel;