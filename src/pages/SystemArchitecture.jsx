import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import CommunicationFlow from '../components/CommunicationFlow';
import SecurityOverview from '../components/SecurityOverview';

const { FiLayers, FiGitBranch, FiShield, FiZap } = FiIcons;

const SystemArchitecture = () => {
  const architectureStats = [
    { label: 'System Components', value: '12', icon: FiLayers, color: 'gold' },
    { label: 'Communication Channels', value: '8', icon: FiGitBranch, color: 'emerald' },
    { label: 'Security Layers', value: '5', icon: FiShield, color: 'blue' },
    { label: 'Performance Score', value: '98.5', icon: FiZap, color: 'purple' },
  ];

  const architecturePrinciples = [
    {
      title: 'Hierarchical Autonomy',
      description: 'Each agent operates with appropriate levels of independence while remaining accountable to higher-level oversight.',
      icon: FiLayers,
      color: 'gold'
    },
    {
      title: 'Mutual Obligation',
      description: 'Reciprocal relationships between agents at different levels, providing resources and services in exchange for specialized capabilities.',
      icon: FiGitBranch,
      color: 'emerald'
    },
    {
      title: 'Evolutionary Capability',
      description: 'Continuous learning, adaptation, and improvement mechanisms across all levels of the hierarchy.',
      icon: FiZap,
      color: 'blue'
    },
    {
      title: 'Transparent Governance',
      description: 'Clear accountability, comprehensive audit trails, and democratic oversight mechanisms.',
      icon: FiShield,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-3">
            <SafeIcon icon={FiLayers} className="text-4xl text-gold-400" />
            <h1 className="text-4xl font-medieval font-bold text-gold-400">System Architecture</h1>
          </div>
          <p className="text-xl text-royal-300 max-w-3xl mx-auto">
            Revolutionary multi-agent AI architecture combining feudal hierarchy with modern capabilities
          </p>
        </motion.div>

        {/* Architecture Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {architectureStats.map((stat, index) => (
            <div key={stat.label} className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-royal-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                  <SafeIcon icon={stat.icon} className={`text-2xl text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Architecture Principles */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {architecturePrinciples.map((principle, index) => (
            <motion.div
              key={principle.title}
              className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-${principle.color}-500/20 flex-shrink-0`}>
                  <SafeIcon icon={principle.icon} className={`text-xl text-${principle.color}-400`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{principle.title}</h3>
                  <p className="text-royal-300 text-sm leading-relaxed">{principle.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div
          className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">System Architecture Diagram</h2>
          <ArchitectureDiagram />
        </motion.div>

        {/* Communication Flow */}
        <motion.div
          className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Communication Flow</h2>
          <CommunicationFlow />
        </motion.div>

        {/* Security Overview */}
        <motion.div
          className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Security Overview</h2>
          <SecurityOverview />
        </motion.div>
      </div>
    </div>
  );
};

export default SystemArchitecture;