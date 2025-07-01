import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { securityService } from '../services/securityService';
import { complianceService } from '../services/complianceService';

const { 
  FiShield, FiAlertTriangle, FiCheck, FiEye, FiLock, 
  FiActivity, FiTrendingUp, FiUsers, FiServer, FiDatabase 
} = FiIcons;

const SecurityDashboard = () => {
  const [securityMetrics, setSecurityMetrics] = useState({});
  const [threatLevel, setThreatLevel] = useState('low');
  const [complianceStatus, setComplianceStatus] = useState({});
  const [securityEvents, setSecurityEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      
      const [metrics, compliance, events] = await Promise.all([
        securityService.getSecurityMetrics('24h'),
        complianceService.performComplianceAudit('general'),
        securityService.getRecentSecurityEvents(20)
      ]);

      setSecurityMetrics(metrics);
      setComplianceStatus(compliance);
      setSecurityEvents(events);
      setThreatLevel(calculateThreatLevel(metrics, events));
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateThreatLevel = (metrics, events) => {
    const criticalEvents = events?.filter(e => e.severity === 'critical').length || 0;
    const highEvents = events?.filter(e => e.severity === 'high').length || 0;
    
    if (criticalEvents > 0) return 'critical';
    if (highEvents > 2) return 'high';
    if (highEvents > 0) return 'medium';
    return 'low';
  };

  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const securityLayerStatus = [
    { layer: 'Perimeter Security', status: 'active', coverage: 98, icon: FiShield },
    { layer: 'Network Security', status: 'active', coverage: 96, icon: FiActivity },
    { layer: 'Application Security', status: 'active', coverage: 94, icon: FiServer },
    { layer: 'Data Security', status: 'active', coverage: 99, icon: FiDatabase },
    { layer: 'Identity & Access', status: 'active', coverage: 97, icon: FiUsers }
  ];

  const complianceFrameworks = [
    { name: 'EU AI Act', status: 'compliant', score: 95, lastAudit: '2024-01-15' },
    { name: 'NIST AI RMF', status: 'compliant', score: 92, lastAudit: '2024-01-12' },
    { name: 'GDPR', status: 'compliant', score: 98, lastAudit: '2024-01-10' },
    { name: 'ISO 27001', status: 'compliant', score: 94, lastAudit: '2024-01-08' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <SafeIcon icon={FiShield} className="animate-spin text-2xl text-royal-400" />
        <span className="ml-2 text-royal-300">Loading security dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          className="bg-royal-700/40 rounded-xl p-6 border border-royal-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-royal-400 text-sm font-medium">Threat Level</p>
              <p className={`text-2xl font-bold text-${getThreatLevelColor(threatLevel)}-400`}>
                {threatLevel.toUpperCase()}
              </p>
            </div>
            <div className={`p-3 rounded-lg bg-${getThreatLevelColor(threatLevel)}-500/20`}>
              <SafeIcon icon={FiShield} className={`text-2xl text-${getThreatLevelColor(threatLevel)}-400`} />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-royal-700/40 rounded-xl p-6 border border-royal-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-royal-400 text-sm font-medium">Security Events</p>
              <p className="text-2xl font-bold text-white">{securityMetrics.total_events || 0}</p>
              <p className="text-emerald-400 text-xs">Last 24 hours</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/20">
              <SafeIcon icon={FiEye} className="text-2xl text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-royal-700/40 rounded-xl p-6 border border-royal-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-royal-400 text-sm font-medium">Compliance Score</p>
              <p className="text-2xl font-bold text-emerald-400">94.8%</p>
              <p className="text-emerald-400 text-xs">All frameworks</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/20">
              <SafeIcon icon={FiCheck} className="text-2xl text-emerald-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-royal-700/40 rounded-xl p-6 border border-royal-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-royal-400 text-sm font-medium">Incidents Resolved</p>
              <p className="text-2xl font-bold text-white">{securityMetrics.resolved_events || 0}</p>
              <p className="text-emerald-400 text-xs">
                MTTR: {securityMetrics.mean_time_to_resolution || 'N/A'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/20">
              <SafeIcon icon={FiTrendingUp} className="text-2xl text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Security Layers Status */}
      <motion.div
        className="bg-royal-700/40 rounded-xl p-6 border border-royal-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiShield} className="text-emerald-400" />
          <span>Defense-in-Depth Security Layers</span>
        </h3>
        <div className="space-y-4">
          {securityLayerStatus.map((layer, index) => (
            <motion.div
              key={layer.layer}
              className="bg-royal-600/30 rounded-lg p-4 border border-royal-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <SafeIcon icon={layer.icon} className="text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{layer.layer}</h4>
                    <p className="text-royal-300 text-sm">Coverage: {layer.coverage}%</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  layer.status === 'active' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {layer.status.toUpperCase()}
                </span>
              </div>
              <div className="w-full bg-royal-500 rounded-full h-2">
                <div 
                  className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${layer.coverage}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Compliance Frameworks */}
      <motion.div
        className="bg-royal-700/40 rounded-xl p-6 border border-royal-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiCheck} className="text-blue-400" />
          <span>Regulatory Compliance Status</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceFrameworks.map((framework, index) => (
            <motion.div
              key={framework.name}
              className="bg-royal-600/30 rounded-lg p-4 border border-royal-500"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">{framework.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400 text-sm">{framework.score}%</span>
                  <SafeIcon icon={FiCheck} className="text-emerald-400 text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-royal-300">Status:</span>
                  <span className={`font-medium ${
                    framework.status === 'compliant' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {framework.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-royal-300">Last Audit:</span>
                  <span className="text-white">{framework.lastAudit}</span>
                </div>
                <div className="w-full bg-royal-500 rounded-full h-1">
                  <div 
                    className="bg-emerald-400 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${framework.score}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Security Events */}
      <motion.div
        className="bg-royal-700/40 rounded-xl p-6 border border-royal-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiAlertTriangle} className="text-yellow-400" />
          <span>Recent Security Events</span>
        </h3>
        <div className="space-y-3">
          {securityEvents.slice(0, 5).map((event, index) => (
            <motion.div
              key={event.id || index}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    event.severity === 'critical' ? 'bg-red-400' :
                    event.severity === 'high' ? 'bg-orange-400' :
                    event.severity === 'medium' ? 'bg-yellow-400' :
                    'bg-green-400'
                  }`}></div>
                  <span className="text-white font-medium">
                    {event.event_type?.replace('_', ' ') || 'Security Event'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-royal-400 text-xs">
                    {new Date(event.created_at || Date.now()).toLocaleTimeString()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    event.resolved 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {event.resolved ? 'RESOLVED' : 'ACTIVE'}
                  </span>
                </div>
              </div>
              <p className="text-royal-300 text-sm">
                {event.description || 'Security event detected and processed by automated systems'}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SecurityDashboard;