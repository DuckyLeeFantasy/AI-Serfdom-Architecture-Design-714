import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCpu, FiHardDrive, FiWifi, FiServer } = FiIcons;

const ResourceAllocation = () => {
  const resourceData = [
    { name: 'King Overseer', cpu: 15, memory: 20, network: 25, color: '#f59e0b' },
    { name: 'Serf Frontend', cpu: 35, memory: 40, network: 50, color: '#10b981' },
    { name: 'Peasant Backend', cpu: 50, memory: 40, network: 25, color: '#3b82f6' },
  ];

  const utilizationData = [
    { name: 'CPU', allocated: 85, used: 68, available: 17 },
    { name: 'Memory', allocated: 75, used: 45, available: 30 },
    { name: 'Network', allocated: 60, used: 35, available: 25 },
    { name: 'Storage', allocated: 90, used: 72, available: 18 },
  ];

  const pieData = [
    { name: 'King Overseer', value: 15, color: '#f59e0b' },
    { name: 'Serf Frontend', value: 35, color: '#10b981' },
    { name: 'Peasant Backend', value: 50, color: '#3b82f6' },
  ];

  return (
    <div className="space-y-6">
      {/* Resource Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
          <h3 className="text-lg font-semibold text-white mb-4">CPU Allocation</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
          <h3 className="text-lg font-semibold text-white mb-4">Resource Utilization</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="used" fill="#10b981" />
                <Bar dataKey="available" fill="#475569" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Resource Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total CPU Cores', value: '32', icon: FiCpu, color: 'gold' },
          { label: 'Memory (GB)', value: '128', icon: FiHardDrive, color: 'emerald' },
          { label: 'Network (Gbps)', value: '10', icon: FiWifi, color: 'blue' },
          { label: 'Storage (TB)', value: '5', icon: FiServer, color: 'purple' },
        ].map((metric, index) => (
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
              </div>
              <div className={`p-2 rounded-lg bg-${metric.color}-500/20`}>
                <SafeIcon icon={metric.icon} className={`text-lg text-${metric.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Agent Resource Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Agent Resource Allocation</h3>
        {resourceData.map((agent, index) => (
          <motion.div
            key={agent.name}
            className="bg-royal-700/30 rounded-lg p-4 border border-royal-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-medium">{agent.name}</h4>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: agent.color }}></div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-royal-300 text-sm mb-1">CPU Usage</p>
                <div className="w-full bg-royal-600 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: `${agent.cpu}%`, backgroundColor: agent.color }}
                  ></div>
                </div>
                <p className="text-white text-sm mt-1">{agent.cpu}%</p>
              </div>
              
              <div>
                <p className="text-royal-300 text-sm mb-1">Memory</p>
                <div className="w-full bg-royal-600 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: `${agent.memory}%`, backgroundColor: agent.color }}
                  ></div>
                </div>
                <p className="text-white text-sm mt-1">{agent.memory}%</p>
              </div>
              
              <div>
                <p className="text-royal-300 text-sm mb-1">Network</p>
                <div className="w-full bg-royal-600 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ width: `${agent.network}%`, backgroundColor: agent.color }}
                  ></div>
                </div>
                <p className="text-white text-sm mt-1">{agent.network}%</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ResourceAllocation;