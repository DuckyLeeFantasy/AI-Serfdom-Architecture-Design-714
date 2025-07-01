import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import DataProcessing from '../components/DataProcessing';
import InfrastructureManagement from '../components/InfrastructureManagement';
import WorkflowExecution from '../components/WorkflowExecution';

const { FiServer, FiDatabase, FiCpu, FiHardDrive, FiSettings, FiActivity } = FiIcons;

const PeasantBackend = () => {
  const [activeTab, setActiveTab] = useState('processing');

  const tabs = [
    { id: 'processing', label: 'Data Processing', icon: FiDatabase },
    { id: 'infrastructure', label: 'Infrastructure', icon: FiCpu },
    { id: 'workflows', label: 'Workflows', icon: FiSettings },
  ];

  const systemMetrics = [
    { label: 'Requests/sec', value: '1,250', change: '+5%', color: 'blue' },
    { label: 'Error Rate', value: '0.1%', change: '-0.05%', color: 'emerald' },
    { label: 'Throughput', value: '8,924', change: '+12%', color: 'purple' },
    { label: 'Uptime', value: '99.8%', change: '+0.1%', color: 'gold' },
  ];

  const activeProcesses = [
    {
      id: 1,
      name: 'Data Ingestion Pipeline',
      status: 'running',
      progress: 85,
      throughput: '2.3 GB/s',
      eta: '2 minutes'
    },
    {
      id: 2,
      name: 'Analytics Processing',
      status: 'running',
      progress: 62,
      throughput: '1.8 GB/s',
      eta: '5 minutes'
    },
    {
      id: 3,
      name: 'Database Optimization',
      status: 'completed',
      progress: 100,
      throughput: '850 MB/s',
      eta: 'Complete'
    },
    {
      id: 4,
      name: 'Backup Synchronization',
      status: 'queued',
      progress: 0,
      throughput: 'Pending',
      eta: 'Waiting'
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
          <div className="p-4 rounded-xl bg-blue-500/20 border border-blue-500/30">
            <SafeIcon icon={FiServer} className="text-3xl text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-medieval font-bold text-blue-400">Peasant Farmer Backend</h1>
            <p className="text-royal-300">Data processing, business logic, and infrastructure management</p>
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
                  metric.change.startsWith('-') && metric.label === 'Error Rate' ? 'text-emerald-400' :
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
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/5'
                    : 'text-royal-300 hover:text-blue-400'
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
            {activeTab === 'processing' && <DataProcessing />}
            {activeTab === 'infrastructure' && <InfrastructureManagement />}
            {activeTab === 'workflows' && <WorkflowExecution />}
          </div>
        </motion.div>

        {/* Active Processes */}
        <motion.div
          className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Active Processes</h2>
          <div className="space-y-4">
            {activeProcesses.map((process) => (
              <div key={process.id} className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      process.status === 'running' ? 'bg-emerald-400 animate-pulse' :
                      process.status === 'completed' ? 'bg-blue-400' :
                      'bg-gray-400'
                    }`}></div>
                    <span className="text-white font-medium">{process.name}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      process.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' :
                      process.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {process.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">{process.throughput}</p>
                    <p className="text-royal-400 text-xs">ETA: {process.eta}</p>
                  </div>
                </div>
                
                <div className="w-full bg-royal-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      process.status === 'running' ? 'bg-emerald-400' :
                      process.status === 'completed' ? 'bg-blue-400' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${process.progress}%` }}
                  ></div>
                </div>
                <p className="text-royal-400 text-xs mt-1">{process.progress}% complete</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PeasantBackend;