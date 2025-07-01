import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiServer, FiCpu, FiHardDrive, FiWifi, FiActivity, FiShield } = FiIcons;

const InfrastructureManagement = () => {
  const infrastructureData = [
    { name: 'CPU', usage: 68, capacity: 100, available: 32 },
    { name: 'Memory', usage: 45, capacity: 100, available: 55 },
    { name: 'Storage', usage: 72, capacity: 100, available: 28 },
    { name: 'Network', usage: 34, capacity: 100, available: 66 },
  ];

  const serverMetrics = [
    { label: 'Active Servers', value: '12', change: '+2', icon: FiServer, color: 'blue' },
    { label: 'CPU Utilization', value: '68%', change: '+5%', icon: FiCpu, color: 'emerald' },
    { label: 'Memory Usage', value: '45%', change: '-2%', icon: FiHardDrive, color: 'gold' },
    { label: 'Network Load', value: '34%', change: '+8%', icon: FiWifi, color: 'purple' },
  ];

  const serverInstances = [
    {
      id: 'srv-001',
      name: 'King Overseer Primary',
      status: 'running',
      cpu: 45,
      memory: 67,
      uptime: '99.9%',
      location: 'US-East-1'
    },
    {
      id: 'srv-002',
      name: 'Frontend Load Balancer',
      status: 'running',
      cpu: 78,
      memory: 42,
      uptime: '99.7%',
      location: 'US-West-2'
    },
    {
      id: 'srv-003',
      name: 'Backend Processing Node 1',
      status: 'running',
      cpu: 89,
      memory: 71,
      uptime: '99.8%',
      location: 'EU-Central-1'
    },
    {
      id: 'srv-004',
      name: 'Backend Processing Node 2',
      status: 'maintenance',
      cpu: 0,
      memory: 0,
      uptime: '98.5%',
      location: 'EU-Central-1'
    },
    {
      id: 'srv-005',
      name: 'Database Primary',
      status: 'running',
      cpu: 56,
      memory: 83,
      uptime: '100%',
      location: 'US-East-1'
    },
    {
      id: 'srv-006',
      name: 'Database Replica',
      status: 'running',
      cpu: 34,
      memory: 45,
      uptime: '99.9%',
      location: 'US-West-2'
    },
  ];

  const networkTopology = [
    {
      component: 'Load Balancer',
      connections: 1543,
      bandwidth: '2.3 Gbps',
      latency: '12ms',
      status: 'optimal'
    },
    {
      component: 'API Gateway',
      connections: 892,
      bandwidth: '1.8 Gbps',
      latency: '8ms',
      status: 'optimal'
    },
    {
      component: 'Message Queue',
      connections: 247,
      bandwidth: '450 Mbps',
      latency: '3ms',
      status: 'optimal'
    },
    {
      component: 'Database Cluster',
      connections: 156,
      bandwidth: '1.2 Gbps',
      latency: '15ms',
      status: 'warning'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Infrastructure Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {serverMetrics.map((metric, index) => (
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
                  metric.change.startsWith('+') && metric.label !== 'CPU Utilization' ? 'text-emerald-400' :
                  metric.change.startsWith('-') && metric.label === 'Memory Usage' ? 'text-emerald-400' :
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

      {/* Resource Utilization Chart */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Resource Utilization</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={infrastructureData}>
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
              <Bar dataKey="usage" fill="#10b981" name="Used %" />
              <Bar dataKey="available" fill="#475569" name="Available %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Server Instances */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Server Instances</h3>
        <div className="space-y-3">
          {serverInstances.map((server, index) => (
            <motion.div
              key={server.id}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    server.status === 'running' ? 'bg-emerald-400 animate-pulse' :
                    server.status === 'maintenance' ? 'bg-yellow-400' :
                    'bg-red-400'
                  }`}></div>
                  <div>
                    <h4 className="text-white font-medium">{server.name}</h4>
                    <p className="text-royal-300 text-sm">{server.id} • {server.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-emerald-400 text-sm">{server.uptime}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    server.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' :
                    server.status === 'maintenance' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {server.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-royal-300 text-sm mb-1">CPU Usage</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-royal-500 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          server.cpu > 80 ? 'bg-red-400' :
                          server.cpu > 60 ? 'bg-yellow-400' :
                          'bg-emerald-400'
                        }`}
                        style={{ width: `${server.cpu}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm w-10">{server.cpu}%</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-royal-300 text-sm mb-1">Memory Usage</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-royal-500 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          server.memory > 80 ? 'bg-red-400' :
                          server.memory > 60 ? 'bg-yellow-400' :
                          'bg-blue-400'
                        }`}
                        style={{ width: `${server.memory}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm w-10">{server.memory}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Network Topology */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Network Topology</h3>
        <div className="space-y-3">
          {networkTopology.map((component, index) => (
            <motion.div
              key={component.component}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{component.component}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  component.status === 'optimal' ? 'bg-emerald-500/20 text-emerald-400' :
                  component.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {component.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-royal-300">Connections</p>
                  <p className="text-white font-medium">{component.connections.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-royal-300">Bandwidth</p>
                  <p className="text-white font-medium">{component.bandwidth}</p>
                </div>
                <div>
                  <p className="text-royal-300">Latency</p>
                  <p className="text-white font-medium">{component.latency}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfrastructureManagement;