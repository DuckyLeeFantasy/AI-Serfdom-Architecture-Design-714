import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const ResourceUtilization = () => {
  const resourceData = [
    { name: 'CPU', used: 68, available: 32, total: 100 },
    { name: 'Memory', used: 45, available: 55, total: 100 },
    { name: 'Storage', used: 72, available: 28, total: 100 },
    { name: 'Network', used: 34, available: 66, total: 100 },
  ];

  const pieData = [
    { name: 'Used', value: 68, color: '#f59e0b' },
    { name: 'Available', value: 32, color: '#475569' },
  ];

  const agentUtilization = [
    { name: 'King Overseer', cpu: 15, memory: 20, network: 10 },
    { name: 'Serf Frontend', cpu: 25, memory: 30, network: 45 },
    { name: 'Peasant Backend', cpu: 60, memory: 50, network: 45 },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Resource Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-white text-sm font-medium mb-3">Overall Resource Usage</h4>
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

        <div>
          <h4 className="text-white text-sm font-medium mb-3">Resource Breakdown</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceData}>
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
                <Bar dataKey="used" fill="#f59e0b" name="Used %" />
                <Bar dataKey="available" fill="#10b981" name="Available %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Agent Resource Usage */}
      <div>
        <h4 className="text-white text-sm font-medium mb-3">Agent Resource Allocation</h4>
        <div className="space-y-3">
          {agentUtilization.map((agent, index) => (
            <motion.div
              key={agent.name}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <h5 className="text-white font-medium mb-3">{agent.name}</h5>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-royal-300 text-sm mb-1">CPU</p>
                  <div className="w-full bg-royal-500 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${agent.cpu}%` }}
                    ></div>
                  </div>
                  <p className="text-white text-xs mt-1">{agent.cpu}%</p>
                </div>
                
                <div>
                  <p className="text-royal-300 text-sm mb-1">Memory</p>
                  <div className="w-full bg-royal-500 rounded-full h-2">
                    <div 
                      className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${agent.memory}%` }}
                    ></div>
                  </div>
                  <p className="text-white text-xs mt-1">{agent.memory}%</p>
                </div>
                
                <div>
                  <p className="text-royal-300 text-sm mb-1">Network</p>
                  <div className="w-full bg-royal-500 rounded-full h-2">
                    <div 
                      className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${agent.network}%` }}
                    ></div>
                  </div>
                  <p className="text-white text-xs mt-1">{agent.network}%</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceUtilization;