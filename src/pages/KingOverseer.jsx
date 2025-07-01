import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import DecisionEngine from '../components/DecisionEngine';
import ResourceAllocation from '../components/ResourceAllocation';
import GovernancePanel from '../components/GovernancePanel';

const { FiCrown, FiShield, FiBrain, FiSettings, FiActivity, FiUsers, FiServer } = FiIcons;

const KingOverseer = () => {
  const [activeTab, setActiveTab] = useState('decisions');

  const tabs = [
    { id: 'decisions', label: 'Decision Engine', icon: FiBrain },
    { id: 'resources', label: 'Resource Allocation', icon: FiSettings },
    { id: 'governance', label: 'Governance', icon: FiShield },
  ];

  const systemMetrics = [
    { label: 'Decisions Made', value: '247', change: '+12%', color: 'gold' },
    { label: 'Accuracy Rate', value: '98.7%', change: '+0.3%', color: 'emerald' },
    { label: 'System Uptime', value: '99.9%', change: '+0.1%', color: 'blue' },
    { label: 'Active Agents', value: '3', change: '0%', color: 'purple' },
  ];

  const recentDecisions = [
    {
      id: 1,
      type: 'Resource Allocation',
      description: 'Increased backend processing capacity by 25%',
      timestamp: '2 minutes ago',
      status: 'executed',
      impact: 'high'
    },
    {
      id: 2,
      type: 'Task Delegation',
      description: 'Assigned user interface optimization to Serf Frontend',
      timestamp: '5 minutes ago',
      status: 'in-progress',
      impact: 'medium'
    },
    {
      id: 3,
      type: 'System Optimization',
      description: 'Initiated database cleanup and indexing',
      timestamp: '8 minutes ago',
      status: 'completed',
      impact: 'low'
    },
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
          <div className="p-4 rounded-xl bg-gold-500/20 border border-gold-500/30">
            <SafeIcon icon={FiCrown} className="text-3xl text-gold-400" />
          </div>
          <div>
            <h1 className="text-3xl font-medieval font-bold text-gold-400">King AI Overseer</h1>
            <p className="text-royal-300">Supreme authority for strategic decision-making and system governance</p>
          </div>
        </motion.div>

        {/* System Metrics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {systemMetrics.map((metric, index) => (
            <div key={metric.label} className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700">
              <div className="space-y-2">
                <p className="text-royal-400 text-sm font-medium">{metric.label}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className={`text-sm font-medium ${
                  metric.change.startsWith('+') ? 'text-emerald-400' : 
                  metric.change.startsWith('-') ? 'text-red-400' : 'text-royal-400'
                }`}>
                  {metric.change} from last hour
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
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
                    ? 'text-gold-400 border-b-2 border-gold-400 bg-gold-400/5'
                    : 'text-royal-300 hover:text-gold-400'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <SafeIcon icon={tab.icon} className="text-lg" />
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'decisions' && <DecisionEngine />}
            {activeTab === 'resources' && <ResourceAllocation />}
            {activeTab === 'governance' && <GovernancePanel />}
          </div>
        </motion.div>

        {/* Recent Decisions */}
        <motion.div
          className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Recent Decisions</h2>
          <div className="space-y-4">
            {recentDecisions.map((decision) => (
              <div key={decision.id} className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-gold-500/20 text-gold-400 rounded">
                        {decision.type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        decision.status === 'executed' ? 'bg-emerald-500/20 text-emerald-400' :
                        decision.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {decision.status.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        decision.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                        decision.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {decision.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <p className="text-white font-medium">{decision.description}</p>
                    <p className="text-royal-400 text-sm mt-1">{decision.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KingOverseer;