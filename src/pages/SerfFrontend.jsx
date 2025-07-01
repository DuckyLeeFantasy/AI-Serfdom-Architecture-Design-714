import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import UserExperience from '../components/UserExperience';
import InterfaceManagement from '../components/InterfaceManagement';
import PersonalizationEngine from '../components/PersonalizationEngine';

const { FiUsers, FiMonitor, FiHeart, FiSettings, FiActivity, FiMessageCircle } = FiIcons;

const SerfFrontend = () => {
  const [activeTab, setActiveTab] = useState('experience');

  const tabs = [
    { id: 'experience', label: 'User Experience', icon: FiHeart },
    { id: 'interface', label: 'Interface Management', icon: FiMonitor },
    { id: 'personalization', label: 'Personalization', icon: FiSettings },
  ];

  const userMetrics = [
    { label: 'Active Users', value: '1,543', change: '+8%', color: 'emerald' },
    { label: 'Satisfaction Score', value: '96.2%', change: '+1.2%', color: 'gold' },
    { label: 'Response Time', value: '0.3s', change: '-0.1s', color: 'blue' },
    { label: 'Interactions', value: '8,924', change: '+15%', color: 'purple' },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'Interface Update',
      description: 'Optimized dashboard layout for mobile devices',
      timestamp: '3 minutes ago',
      status: 'completed',
      impact: 'User engagement increased by 12%'
    },
    {
      id: 2,
      type: 'Personalization',
      description: 'Updated recommendation algorithm for 247 users',
      timestamp: '7 minutes ago',
      status: 'in-progress',
      impact: 'Expected satisfaction improvement: 5%'
    },
    {
      id: 3,
      type: 'Performance',
      description: 'Reduced page load time by implementing lazy loading',
      timestamp: '12 minutes ago',
      status: 'completed',
      impact: 'Load time reduced by 40%'
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
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
            <SafeIcon icon={FiUsers} className="text-3xl text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-medieval font-bold text-emerald-400">Serf Servant Frontend</h1>
            <p className="text-royal-300">User-facing interface management and experience optimization</p>
          </div>
        </motion.div>

        {/* User Metrics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {userMetrics.map((metric, index) => (
            <div key={metric.label} className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700">
              <div className="space-y-2">
                <p className="text-royal-400 text-sm font-medium">{metric.label}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className={`text-sm font-medium ${
                  metric.change.startsWith('+') ? 'text-emerald-400' : 
                  metric.change.startsWith('-') && metric.label === 'Response Time' ? 'text-emerald-400' :
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
                    ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5'
                    : 'text-royal-300 hover:text-emerald-400'
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
            {activeTab === 'experience' && <UserExperience />}
            {activeTab === 'interface' && <InterfaceManagement />}
            {activeTab === 'personalization' && <PersonalizationEngine />}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded">
                        {activity.type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        activity.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        activity.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {activity.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white font-medium">{activity.description}</p>
                    <p className="text-emerald-400 text-sm mt-1">{activity.impact}</p>
                    <p className="text-royal-400 text-sm mt-1">{activity.timestamp}</p>
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

export default SerfFrontend;