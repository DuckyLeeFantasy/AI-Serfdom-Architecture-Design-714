import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const PerformanceMetrics = () => {
  const data = [
    { time: '00:00', cpu: 65, memory: 42, network: 28, response: 0.3 },
    { time: '00:15', cpu: 68, memory: 45, network: 32, response: 0.28 },
    { time: '00:30', cpu: 72, memory: 48, network: 35, response: 0.32 },
    { time: '00:45', cpu: 69, memory: 46, network: 30, response: 0.29 },
    { time: '01:00', cpu: 71, memory: 49, network: 33, response: 0.31 },
    { time: '01:15', cpu: 68, memory: 44, network: 29, response: 0.27 },
  ];

  return (
    <div className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700">
      <h2 className="text-xl font-semibold text-white mb-6">Performance Overview</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
              dataKey="cpu" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="CPU Usage (%)"
            />
            <Line 
              type="monotone" 
              dataKey="memory" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Memory Usage (%)"
            />
            <Line 
              type="monotone" 
              dataKey="network" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Network I/O (MB/s)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <div className="w-3 h-3 bg-gold-400 rounded-full mx-auto mb-1"></div>
          <p className="text-royal-300 text-xs">CPU Usage</p>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 bg-emerald-400 rounded-full mx-auto mb-1"></div>
          <p className="text-royal-300 text-xs">Memory Usage</p>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 bg-blue-400 rounded-full mx-auto mb-1"></div>
          <p className="text-royal-300 text-xs">Network I/O</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;