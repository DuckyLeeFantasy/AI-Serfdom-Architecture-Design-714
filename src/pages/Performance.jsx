import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PerformanceCharts from '../components/PerformanceCharts';
import ResourceUtilization from '../components/ResourceUtilization';
import SystemHealth from '../components/SystemHealth';

const { FiActivity, FiCpu, FiHardDrive, FiWifi, FiTrendingUp, FiAlertTriangle } = FiIcons;

const Performance = () => {
  const [timeRange, setTimeRange] = useState('1h');

  const performanceMetrics = [
    { label: 'CPU Usage', value: '68%', trend: '+2%', status: 'normal', icon: FiCpu },
    { label: 'Memory Usage', value: '45%', trend: '-1%', status: 'normal', icon: FiHardDrive },
    { label: 'Network I/O', value: '234 MB/s', trend: '+12%', status: 'normal', icon: FiWifi },
    { label: 'Response Time', value: '0.3s', trend: '-0.05s', status: 'good', icon: FiActivity },
  ];

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'High CPU Usage Detected',
      description: 'Backend processing is experiencing elevated CPU usage',
      timestamp: '5 minutes ago',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'info',
      title: 'Auto-scaling Triggered',
      description: 'Additional resources provisioned to handle increased load',
      timestamp: '8 minutes ago',
      severity: 'low'
    },
    {
      id: 3,
      type: 'success',
      title: 'Performance Optimization Complete',
      description: 'Database indexing improved query performance by 25%',
      timestamp: '15 minutes ago',
      severity: 'low'
    },
  ];

  const timeRanges = [
    { value: '1h', label: '1 Hour' },
    { value: '6h', label: '6 Hours' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
              <SafeIcon icon={FiActivity} className="text-3xl text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-medieval font-bold text-emerald-400">Performance Monitoring</h1>
              <p className="text-royal-300">Real-time system performance and health metrics</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range.value
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-royal-300 hover:text-emerald-400 hover:bg-royal-800/50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {performanceMetrics.map((metric, index) => (
            <div key={metric.label} className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${
                  metric.status === 'good' ? 'bg-emerald-500/20' :
                  metric.status === 'warning' ? 'bg-yellow-500/20' :
                  'bg-blue-500/20'
                }`}>
                  <SafeIcon icon={metric.icon} className={`text-lg ${
                    metric.status === 'good' ? 'text-emerald-400' :
                    metric.status === 'warning' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`} />
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  metric.status === 'good' ? 'bg-emerald-500/20 text-emerald-400' :
                  metric.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {metric.status.toUpperCase()}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-royal-400 text-sm font-medium">{metric.label}</p>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className={`text-sm font-medium flex items-center space-x-1 ${
                  metric.trend.startsWith('+') && metric.label !== 'Response Time' ? 'text-emerald-400' :
                  metric.trend.startsWith('-') && metric.label === 'Response Time' ? 'text-emerald-400' :
                  metric.trend.startsWith('-') ? 'text-red-400' :
                  'text-emerald-400'
                }`}>
                  <SafeIcon icon={FiTrendingUp} className="text-xs" />
                  <span>{metric.trend} from last hour</span>
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Performance Charts */}
        <motion.div
          className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Performance Trends</h2>
          <PerformanceCharts timeRange={timeRange} />
        </motion.div>

        {/* Resource Utilization and System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">Resource Utilization</h2>
            <ResourceUtilization />
          </motion.div>

          <motion.div
            className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-white mb-6">System Health</h2>
            <SystemHealth />
          </motion.div>
        </div>

        {/* System Alerts */}
        <motion.div
          className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">System Alerts</h2>
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    alert.type === 'warning' ? 'bg-yellow-500/20' :
                    alert.type === 'success' ? 'bg-emerald-500/20' :
                    'bg-blue-500/20'
                  }`}>
                    <SafeIcon icon={
                      alert.type === 'warning' ? FiAlertTriangle :
                      alert.type === 'success' ? FiActivity :
                      FiActivity
                    } className={`text-lg ${
                      alert.type === 'warning' ? 'text-yellow-400' :
                      alert.type === 'success' ? 'text-emerald-400' :
                      'text-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{alert.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        alert.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                        alert.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-royal-300 text-sm mb-2">{alert.description}</p>
                    <p className="text-royal-400 text-xs">{alert.timestamp}</p>
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

export default Performance;