import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiShield, FiLock, FiKey, FiEye, FiCheck, FiAlertTriangle, FiUserCheck } = FiIcons;

const SecurityOverview = () => {
  const securityLayers = [
    {
      id: 1,
      name: 'Authentication Layer',
      icon: FiUserCheck,
      color: 'blue',
      status: 'active',
      coverage: 100,
      description: 'Multi-factor authentication and identity verification'
    },
    {
      id: 2,
      name: 'Authorization Layer',
      icon: FiKey,
      color: 'emerald',
      status: 'active',
      coverage: 98,
      description: 'Role-based access control and permissions management'
    },
    {
      id: 3,
      name: 'Encryption Layer',
      icon: FiLock,
      color: 'purple',
      status: 'active',
      coverage: 100,
      description: 'End-to-end encryption for data in transit and at rest'
    },
    {
      id: 4,
      name: 'Monitoring Layer',
      icon: FiEye,
      color: 'gold',
      status: 'active',
      coverage: 95,
      description: 'Real-time security monitoring and threat detection'
    },
    {
      id: 5,
      name: 'Audit Layer',
      icon: FiShield,
      color: 'red',
      status: 'active',
      coverage: 100,
      description: 'Comprehensive logging and compliance tracking'
    }
  ];

  const securityMetrics = [
    { label: 'Security Score', value: '99.2%', icon: FiShield, color: 'emerald' },
    { label: 'Threats Blocked', value: '1,247', icon: FiCheck, color: 'blue' },
    { label: 'Vulnerabilities', value: '0', icon: FiAlertTriangle, color: 'green' },
    { label: 'Compliance Level', value: '100%', icon: FiUserCheck, color: 'purple' },
  ];

  const securityEvents = [
    {
      id: 1,
      type: 'Authentication Success',
      agent: 'Serf Frontend',
      timestamp: '14:30:22',
      severity: 'info',
      details: 'User successfully authenticated with MFA'
    },
    {
      id: 2,
      type: 'Access Granted',
      agent: 'King AI Overseer',
      timestamp: '14:28:15',
      severity: 'info',
      details: 'Administrative access granted for system maintenance'
    },
    {
      id: 3,
      type: 'Encryption Check',
      agent: 'Security Layer',
      timestamp: '14:25:08',
      severity: 'info',
      details: 'Data encryption verification completed successfully'
    },
    {
      id: 4,
      type: 'Anomaly Detected',
      agent: 'Monitoring System',
      timestamp: '14:20:45',
      severity: 'warning',
      details: 'Unusual network traffic pattern detected and analyzed'
    }
  ];

  const complianceStandards = [
    { name: 'SOC 2 Type II', status: 'compliant', lastAudit: '2024-01-10' },
    { name: 'ISO 27001', status: 'compliant', lastAudit: '2024-01-08' },
    { name: 'GDPR', status: 'compliant', lastAudit: '2024-01-12' },
    { name: 'HIPAA', status: 'compliant', lastAudit: '2024-01-05' },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'info': return 'blue';
      case 'warning': return 'yellow';
      case 'error': return 'red';
      case 'critical': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="bg-royal-700/40 rounded-lg p-4 border border-royal-600"
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

      {/* Security Layers */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Security Architecture</h4>
        <div className="space-y-3">
          {securityLayers.map((layer, index) => (
            <motion.div
              key={layer.id}
              className="bg-royal-700/40 rounded-lg p-4 border border-royal-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-${layer.color}-500/20`}>
                    <SafeIcon icon={layer.icon} className={`text-lg text-${layer.color}-400`} />
                  </div>
                  <div>
                    <h5 className="text-white font-medium">{layer.name}</h5>
                    <p className="text-royal-300 text-sm">{layer.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    layer.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {layer.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-royal-300 text-sm">Coverage:</span>
                <div className="flex-1 bg-royal-500 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      layer.coverage >= 98 ? 'bg-emerald-400' :
                      layer.coverage >= 90 ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}
                    style={{ width: `${layer.coverage}%` }}
                  ></div>
                </div>
                <span className="text-white text-sm font-medium">{layer.coverage}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Security Events */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Recent Security Events</h4>
        <div className="space-y-3">
          {securityEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className="bg-royal-700/40 rounded-lg p-3 border border-royal-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${getSeverityColor(event.severity)}-400`}></div>
                  <span className="text-white font-medium">{event.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-royal-300 text-sm">{event.agent}</span>
                  <span className="text-royal-400 text-xs">{event.timestamp}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded bg-${getSeverityColor(event.severity)}-500/20 text-${getSeverityColor(event.severity)}-400`}>
                    {event.severity.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="text-royal-300 text-sm">{event.details}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Compliance Standards */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Compliance Standards</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceStandards.map((standard, index) => (
            <motion.div
              key={standard.name}
              className="bg-royal-700/40 rounded-lg p-4 border border-royal-600"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-white font-medium">{standard.name}</h5>
                  <p className="text-royal-300 text-sm">Last audit: {standard.lastAudit}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCheck} className="text-emerald-400 text-sm" />
                  <span className="px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded">
                    {standard.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityOverview;