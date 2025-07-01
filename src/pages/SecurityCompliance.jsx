import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SecurityDashboard from '../components/SecurityDashboard';
import ComplianceFramework from '../components/ComplianceFramework';
import GovernanceDashboard from '../components/GovernanceDashboard';

const { FiShield, FiCheck, FiUsers, FiFileText, FiEye, FiLock } = FiIcons;

const SecurityCompliance = () => {
  const [activeTab, setActiveTab] = useState('security');

  const tabs = [
    { id: 'security', label: 'Security Dashboard', icon: FiShield, color: 'red' },
    { id: 'compliance', label: 'Compliance Framework', icon: FiCheck, color: 'emerald' },
    { id: 'governance', label: 'AI Governance', icon: FiUsers, color: 'blue' }
  ];

  const securityHighlights = [
    {
      title: 'Multi-Agent Security Architecture',
      description: 'Defense-in-depth security model protecting all agent types',
      icon: FiLock,
      status: 'active'
    },
    {
      title: 'Real-time Threat Detection',
      description: 'AI-powered threat detection with automated response capabilities',
      icon: FiEye,
      status: 'monitoring'
    },
    {
      title: 'Comprehensive Audit Framework',
      description: 'Complete audit trails for all system activities and decisions',
      icon: FiFileText,
      status: 'operational'
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30">
            <SafeIcon icon={FiShield} className="text-3xl text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-medieval font-bold text-red-400">
              Security & Compliance Framework
            </h1>
            <p className="text-royal-300">
              Comprehensive security, compliance, and governance for AI-Serfdom System
            </p>
          </div>
        </motion.div>

        {/* Security Highlights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {securityHighlights.map((highlight, index) => (
            <div
              key={highlight.title}
              className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-lg bg-emerald-500/20">
                  <SafeIcon icon={highlight.icon} className="text-xl text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{highlight.title}</h3>
                  <p className="text-royal-300 text-sm mb-3">{highlight.description}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    highlight.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    highlight.status === 'monitoring' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {highlight.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          className="bg-royal-800/50 backdrop-blur-sm rounded-xl border border-royal-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex border-b border-royal-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? `text-${tab.color}-400 border-b-2 border-${tab.color}-400 bg-${tab.color}-400/5`
                    : 'text-royal-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <SafeIcon icon={tab.icon} className="text-lg" />
                  <span className="hidden sm:block">{tab.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'security' && <SecurityDashboard />}
            {activeTab === 'compliance' && <ComplianceFramework />}
            {activeTab === 'governance' && <GovernanceDashboard />}
          </div>
        </motion.div>

        {/* Framework Summary */}
        <motion.div
          className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Framework Implementation Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { framework: 'EU AI Act', implementation: 95, status: 'compliant' },
              { framework: 'NIST AI RMF', implementation: 92, status: 'compliant' },
              { framework: 'GDPR', implementation: 98, status: 'compliant' },
              { framework: 'ISO 27001', implementation: 94, status: 'compliant' }
            ].map((framework, index) => (
              <div key={framework.framework} className="text-center">
                <h3 className="text-white font-medium mb-2">{framework.framework}</h3>
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-royal-600"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-400"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${framework.implementation}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-emerald-400 font-bold">{framework.implementation}%</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  framework.status === 'compliant' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {framework.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SecurityCompliance;