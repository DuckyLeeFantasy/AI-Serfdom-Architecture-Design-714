import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import SystemStatus from '../components/SystemStatus';
import HierarchyVisualization from '../components/HierarchyVisualization';
import PerformanceMetrics from '../components/PerformanceMetrics';
import LiveDataDisplay from '../components/LiveDataDisplay';
import SupabaseIntegration from '../components/SupabaseIntegration';

const { FiCrown, FiUsers, FiServer, FiArrowRight, FiActivity, FiShield, FiCpu, FiDatabase } = FiIcons;

const Dashboard = ({ activeAgent, setActiveAgent }) => {
  const agents = [
    {
      id: 'king',
      title: 'King AI Overseer',
      description: 'Supreme authority for strategic decision-making and system governance',
      icon: FiCrown,
      color: 'gold',
      status: 'active',
      metrics: { decisions: 247, accuracy: 98.7, uptime: 99.9 },
      path: '/king'
    },
    {
      id: 'serf',
      title: 'Serf Servant Frontend',
      description: 'User-facing interface management and experience optimization',
      icon: FiUsers,
      color: 'emerald',
      status: 'active',
      metrics: { interactions: 1543, satisfaction: 96.2, response: 0.3 },
      path: '/serf'
    },
    {
      id: 'peasant',
      title: 'Peasant Farmer Backend',
      description: 'Data processing, business logic, and infrastructure management',
      icon: FiServer,
      color: 'blue',
      status: 'active',
      metrics: { requests: 8924, throughput: 1250, errors: 0.1 },
      path: '/peasant'
    }
  ];

  const systemStats = [
    { label: 'Total Agents', value: '3', icon: FiCpu, color: 'gold' },
    { label: 'Active Tasks', value: '127', icon: FiActivity, color: 'emerald' },
    { label: 'System Health', value: '99.2%', icon: FiShield, color: 'blue' },
    { label: 'Database Status', value: 'Connected', icon: FiDatabase, color: 'purple' }
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
          <h1 className="text-4xl font-medieval font-bold text-gold-400">
            AI-Serfdom System Architecture
          </h1>
          <p className="text-xl text-royal-300 max-w-3xl mx-auto">
            Revolutionary multi-agent AI system with comprehensive Supabase backend integration
          </p>
        </motion.div>

        {/* System Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {systemStats.map((stat, index) => (
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

        {/* Agent Cards */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              className={`relative bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700 hover:border-${agent.color}-500/50 transition-all duration-300 group cursor-pointer`}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setActiveAgent(agent.id)}
            >
              <Link to={agent.path} className="block">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg bg-${agent.color}-500/20 group-hover:bg-${agent.color}-500/30 transition-colors`}>
                      <SafeIcon icon={agent.icon} className={`text-2xl text-${agent.color}-400`} />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400`}>
                      {agent.status.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{agent.title}</h3>
                    <p className="text-royal-300 text-sm leading-relaxed">{agent.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-royal-700">
                    {Object.entries(agent.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-lg font-semibold text-white">{value}</p>
                        <p className="text-xs text-royal-400 capitalize">{key}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-sm text-royal-400">View Details</span>
                    <SafeIcon icon={FiArrowRight} className={`text-${agent.color}-400 group-hover:translate-x-1 transition-transform`} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Supabase Backend Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700">
            <SupabaseIntegration />
          </div>
        </motion.div>

        {/* Live Data Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700">
            <LiveDataDisplay />
          </div>
        </motion.div>

        {/* System Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <SystemStatus />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <HierarchyVisualization />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <PerformanceMetrics />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;