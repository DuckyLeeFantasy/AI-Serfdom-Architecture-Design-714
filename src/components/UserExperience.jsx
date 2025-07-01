import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHeart, FiUsers, FiClock, FiTrendingUp, FiStar } = FiIcons;

const UserExperience = () => {
  const satisfactionData = [
    { time: '00:00', satisfaction: 94, engagement: 78, retention: 85 },
    { time: '04:00', satisfaction: 96, engagement: 82, retention: 87 },
    { time: '08:00', satisfaction: 95, engagement: 85, retention: 89 },
    { time: '12:00', satisfaction: 97, engagement: 88, retention: 91 },
    { time: '16:00', satisfaction: 96, engagement: 86, retention: 88 },
    { time: '20:00', satisfaction: 98, engagement: 90, retention: 92 },
  ];

  const userMetrics = [
    { label: 'Active Users', value: '1,543', change: '+8%', icon: FiUsers, color: 'emerald' },
    { label: 'Avg Session', value: '12m 34s', change: '+2m', icon: FiClock, color: 'blue' },
    { label: 'Satisfaction', value: '96.2%', change: '+1.2%', icon: FiHeart, color: 'pink' },
    { label: 'User Rating', value: '4.8/5', change: '+0.1', icon: FiStar, color: 'gold' },
  ];

  const userFeedback = [
    {
      id: 1,
      user: 'User #1247',
      rating: 5,
      comment: 'The interface is incredibly intuitive and responsive. Love the personalized recommendations!',
      timestamp: '2 hours ago',
      category: 'Interface'
    },
    {
      id: 2,
      user: 'User #0892',
      rating: 4,
      comment: 'Great performance improvements. The system feels much faster now.',
      timestamp: '4 hours ago',
      category: 'Performance'
    },
    {
      id: 3,
      user: 'User #1456',
      rating: 5,
      comment: 'Excellent user experience. The AI suggestions are spot on.',
      timestamp: '6 hours ago',
      category: 'AI Features'
    },
  ];

  const improvements = [
    {
      id: 1,
      title: 'Mobile Interface Optimization',
      description: 'Enhanced mobile responsiveness and touch interactions',
      impact: '+12% mobile engagement',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Personalization Algorithm Update',
      description: 'Improved recommendation accuracy based on user behavior',
      impact: '+8% user satisfaction',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Loading Speed Optimization',
      description: 'Reduced initial page load time through code splitting',
      impact: '+15% conversion rate',
      status: 'completed'
    },
  ];

  return (
    <div className="space-y-6">
      {/* User Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {userMetrics.map((metric, index) => (
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

      {/* Satisfaction Trends */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">User Experience Trends</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={satisfactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="satisfaction" 
                stroke="#ec4899" 
                strokeWidth={2}
                name="Satisfaction (%)"
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Engagement (%)"
              />
              <Line 
                type="monotone" 
                dataKey="retention" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Retention (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Feedback */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Recent User Feedback</h3>
        <div className="space-y-3">
          {userFeedback.map((feedback, index) => (
            <motion.div
              key={feedback.id}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{feedback.user}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <SafeIcon
                        key={i}
                        icon={FiStar}
                        className={`text-sm ${
                          i < feedback.rating ? 'text-gold-400' : 'text-royal-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded">
                    {feedback.category}
                  </span>
                  <span className="text-royal-400 text-xs">{feedback.timestamp}</span>
                </div>
              </div>
              <p className="text-royal-300 text-sm">{feedback.comment}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* UX Improvements */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Recent UX Improvements</h3>
        <div className="space-y-3">
          {improvements.map((improvement, index) => (
            <motion.div
              key={improvement.id}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{improvement.title}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  improvement.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                  improvement.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {improvement.status.toUpperCase()}
                </span>
              </div>
              <p className="text-royal-300 text-sm mb-2">{improvement.description}</p>
              <p className="text-emerald-400 text-sm font-medium">{improvement.impact}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserExperience;