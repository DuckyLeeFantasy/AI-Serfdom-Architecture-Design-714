import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDatabase, FiTrendingUp, FiActivity, FiServer, FiHardDrive, FiZap } = FiIcons;

const DataProcessing = () => {
  const processingData = [
    { time: '00:00', ingestion: 2.3, processing: 1.8, output: 1.5 },
    { time: '04:00', ingestion: 2.1, processing: 1.9, output: 1.6 },
    { time: '08:00', ingestion: 2.8, processing: 2.2, output: 1.9 },
    { time: '12:00', ingestion: 3.2, processing: 2.5, output: 2.1 },
    { time: '16:00', ingestion: 2.9, processing: 2.3, output: 2.0 },
    { time: '20:00', ingestion: 2.5, processing: 2.0, output: 1.7 },
  ];

  const dataMetrics = [
    { label: 'Data Ingested', value: '2.3 GB/s', change: '+12%', icon: FiDatabase, color: 'blue' },
    { label: 'Processing Rate', value: '1,250/s', change: '+8%', icon: FiZap, color: 'emerald' },
    { label: 'Queue Length', value: '47', change: '-15%', icon: FiActivity, color: 'gold' },
    { label: 'Storage Used', value: '78%', change: '+3%', icon: FiHardDrive, color: 'purple' },
  ];

  const dataSources = [
    {
      id: 1,
      name: 'User Interactions',
      type: 'Real-time Stream',
      volume: '1.2 GB/s',
      status: 'healthy',
      latency: '23ms'
    },
    {
      id: 2,
      name: 'System Metrics',
      type: 'Time Series',
      volume: '450 MB/s',
      status: 'healthy',
      latency: '12ms'
    },
    {
      id: 3,
      name: 'External APIs',
      type: 'Batch Processing',
      volume: '680 MB/s',
      status: 'warning',
      latency: '156ms'
    },
    {
      id: 4,
      name: 'File Uploads',
      type: 'Object Storage',
      volume: '320 MB/s',
      status: 'healthy',
      latency: '45ms'
    },
  ];

  const pipelineStages = [
    {
      stage: 'Data Ingestion',
      status: 'active',
      throughput: '2.3 GB/s',
      efficiency: 94,
      errors: 0.1
    },
    {
      stage: 'Data Validation',
      status: 'active',
      throughput: '2.2 GB/s',
      efficiency: 97,
      errors: 0.05
    },
    {
      stage: 'Data Transformation',
      status: 'active',
      throughput: '1.9 GB/s',
      efficiency: 89,
      errors: 0.2
    },
    {
      stage: 'Data Storage',
      status: 'active',
      throughput: '1.8 GB/s',
      efficiency: 92,
      errors: 0.08
    },
  ];

  return (
    <div className="space-y-6">
      {/* Data Processing Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dataMetrics.map((metric, index) => (
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
                <p className={`text-xs ${
                  metric.change.startsWith('+') && metric.label !== 'Queue Length' ? 'text-emerald-400' :
                  metric.change.startsWith('-') && metric.label === 'Queue Length' ? 'text-emerald-400' :
                  metric.change.startsWith('-') ? 'text-red-400' :
                  'text-emerald-400'
                }`}>
                  {metric.change}
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-${metric.color}-500/20`}>
                <SafeIcon icon={metric.icon} className={`text-lg text-${metric.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Processing Throughput Chart */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Data Processing Throughput</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={processingData}>
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
              <Area 
                type="monotone" 
                dataKey="ingestion" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Ingestion (GB/s)"
              />
              <Area 
                type="monotone" 
                dataKey="processing" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981"
                fillOpacity={0.3}
                name="Processing (GB/s)"
              />
              <Area 
                type="monotone" 
                dataKey="output" 
                stackId="1"
                stroke="#f59e0b" 
                fill="#f59e0b"
                fillOpacity={0.3}
                name="Output (GB/s)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Data Sources</h3>
        <div className="space-y-3">
          {dataSources.map((source, index) => (
            <motion.div
              key={source.id}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    source.status === 'healthy' ? 'bg-emerald-400 animate-pulse' :
                    source.status === 'warning' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`}></div>
                  <h4 className="text-white font-medium">{source.name}</h4>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded">
                    {source.type}
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  source.status === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' :
                  source.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {source.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-royal-300">Volume</p>
                  <p className="text-white font-medium">{source.volume}</p>
                </div>
                <div>
                  <p className="text-royal-300">Latency</p>
                  <p className="text-white font-medium">{source.latency}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Processing Pipeline</h3>
        <div className="space-y-3">
          {pipelineStages.map((stage, index) => (
            <motion.div
              key={stage.stage}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 font-bold text-sm">{index + 1}</span>
                  </div>
                  <h4 className="text-white font-medium">{stage.stage}</h4>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  stage.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {stage.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-royal-300">Throughput</p>
                  <p className="text-white font-medium">{stage.throughput}</p>
                </div>
                <div>
                  <p className="text-royal-300">Efficiency</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 bg-royal-500 rounded-full h-1">
                      <div 
                        className="bg-emerald-400 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${stage.efficiency}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium">{stage.efficiency}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-royal-300">Error Rate</p>
                  <p className="text-white font-medium">{stage.errors}%</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataProcessing;