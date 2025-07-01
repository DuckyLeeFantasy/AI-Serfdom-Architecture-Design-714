import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiTarget, FiTrendingUp, FiSettings, FiBrain, FiEye } = FiIcons;

const PersonalizationEngine = () => {
  const userSegments = [
    { name: 'Power Users', value: 35, color: '#f59e0b', users: 540 },
    { name: 'Regular Users', value: 45, color: '#10b981', users: 695 },
    { name: 'New Users', value: 20, color: '#3b82f6', users: 308 },
  ];

  const personalizationMetrics = [
    { label: 'Personalized Users', value: '1,247', change: '+12%', icon: FiUser, color: 'emerald' },
    { label: 'Accuracy Rate', value: '94.3%', change: '+2.1%', icon: FiTarget, color: 'blue' },
    { label: 'Engagement Lift', value: '+23%', change: '+5%', icon: FiTrendingUp, color: 'gold' },
    { label: 'Active Models', value: '8', change: '+2', icon: FiBrain, color: 'purple' },
  ];

  const behaviorData = [
    { category: 'Dashboard', views: 1250, engagement: 85, satisfaction: 92 },
    { category: 'Analytics', views: 890, engagement: 78, satisfaction: 88 },
    { category: 'Reports', views: 650, engagement: 72, satisfaction: 85 },
    { category: 'Settings', views: 420, engagement: 65, satisfaction: 79 },
  ];

  const recommendations = [
    {
      id: 1,
      type: 'Interface Layout',
      description: 'Suggest dashboard widget rearrangement for power users',
      impact: '+15% productivity',
      confidence: 92,
      users: 540
    },
    {
      id: 2,
      type: 'Feature Discovery',
      description: 'Highlight advanced analytics features for regular users',
      impact: '+8% feature adoption',
      confidence: 87,
      users: 695
    },
    {
      id: 3,
      type: 'Onboarding Flow',
      description: 'Personalized tutorial sequence for new users',
      impact: '+25% completion rate',
      confidence: 94,
      users: 308
    },
  ];

  const adaptiveFeatures = [
    {
      feature: 'Smart Notifications',
      status: 'active',
      users: 1156,
      effectiveness: 89,
      description: 'AI-powered notification timing and content optimization'
    },
    {
      feature: 'Dynamic Interface',
      status: 'active',
      users: 982,
      effectiveness: 76,
      description: 'Adaptive UI elements based on user behavior patterns'
    },
    {
      feature: 'Content Recommendations',
      status: 'testing',
      users: 247,
      effectiveness: 91,
      description: 'Personalized content and feature suggestions'
    },
    {
      feature: 'Workflow Automation',
      status: 'development',
      users: 0,
      effectiveness: 0,
      description: 'Automated task sequences based on user patterns'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Personalization Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {personalizationMetrics.map((metric, index) => (
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
                <p className="text-emerald-400 text-xs">{metric.change}</p>
              </div>
              <div className={`p-2 rounded-lg bg-${metric.color}-500/20`}>
                <SafeIcon icon={metric.icon} className={`text-lg text-${metric.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User Segments and Behavior */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
          <h3 className="text-lg font-semibold text-white mb-4">User Segments</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userSegments}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {userSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {userSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                  <span className="text-white">{segment.name}</span>
                </div>
                <span className="text-royal-300">{segment.users} users</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
          <h3 className="text-lg font-semibold text-white mb-4">User Behavior Analysis</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={behaviorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="category" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="engagement" fill="#10b981" />
                <Bar dataKey="satisfaction" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Personalization Recommendations */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiTarget} className="text-gold-400" />
          <span>AI Recommendations</span>
        </h3>
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-gold-500/20 text-gold-400 rounded">
                    {rec.type}
                  </span>
                  <span className="text-royal-300 text-sm">{rec.users} users affected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400 text-sm">{rec.confidence}% confidence</span>
                </div>
              </div>
              <h4 className="text-white font-medium mb-1">{rec.description}</h4>
              <p className="text-emerald-400 text-sm">{rec.impact}</p>
              
              <div className="mt-2 w-full bg-royal-500 rounded-full h-1">
                <div 
                  className="bg-emerald-400 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${rec.confidence}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Adaptive Features */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiSettings} className="text-blue-400" />
          <span>Adaptive Features</span>
        </h3>
        <div className="space-y-3">
          {adaptiveFeatures.map((feature, index) => (
            <motion.div
              key={feature.feature}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{feature.feature}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  feature.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                  feature.status === 'testing' ? 'bg-blue-500/20 text-blue-400' :
                  feature.status === 'development' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {feature.status.toUpperCase()}
                </span>
              </div>
              
              <p className="text-royal-300 text-sm mb-3">{feature.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-royal-300">Active Users</p>
                  <p className="text-white font-medium">{feature.users.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-royal-300">Effectiveness</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-royal-500 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${
                          feature.effectiveness >= 80 ? 'bg-emerald-400' :
                          feature.effectiveness >= 60 ? 'bg-blue-400' :
                          feature.effectiveness > 0 ? 'bg-yellow-400' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${feature.effectiveness}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium">{feature.effectiveness}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalizationEngine;