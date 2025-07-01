import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const PerformanceCharts = ({ timeRange }) => {
  const generateData = (range) => {
    const baseData = [
      { time: '00:00', cpu: 65, memory: 42, network: 28, response: 0.3, throughput: 1200 },
      { time: '02:00', cpu: 68, memory: 45, network: 32, response: 0.28, throughput: 1250 },
      { time: '04:00', cpu: 72, memory: 48, network: 35, response: 0.32, throughput: 1180 },
      { time: '06:00', cpu: 69, memory: 46, network: 30, response: 0.29, throughput: 1300 },
      { time: '08:00', cpu: 71, memory: 49, network: 33, response: 0.31, throughput: 1275 },
      { time: '10:00', cpu: 68, memory: 44, network: 29, response: 0.27, throughput: 1320 },
      { time: '12:00', cpu: 74, memory: 52, network: 38, response: 0.35, throughput: 1150 },
      { time: '14:00', cpu: 70, memory: 47, network: 31, response: 0.30, throughput: 1290 },
      { time: '16:00', cpu: 66, memory: 43, network: 27, response: 0.26, throughput: 1350 },
      { time: '18:00', cpu: 73, memory: 50, network: 36, response: 0.33, throughput: 1200 },
      { time: '20:00', cpu: 69, memory: 45, network: 32, response: 0.29, throughput: 1280 },
      { time: '22:00', cpu: 67, memory: 41, network: 25, response: 0.25, throughput: 1360 },
    ];
    
    // Adjust data based on time range
    switch (range) {
      case '1h':
        return baseData.slice(-4);
      case '6h':
        return baseData.slice(-6);
      case '7d':
        return baseData.map((item, index) => ({
          ...item,
          time: `Day ${index + 1}`
        }));
      default:
        return baseData;
    }
  };

  const data = generateData(timeRange);

  return (
    <div className="space-y-6">
      {/* System Performance Chart */}
      <div className="h-64">
        <h4 className="text-white text-sm font-medium mb-3">System Performance Metrics</h4>
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
              name="CPU (%)"
            />
            <Line 
              type="monotone" 
              dataKey="memory" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Memory (%)"
            />
            <Line 
              type="monotone" 
              dataKey="network" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Network (MB/s)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Throughput Chart */}
      <div className="h-64">
        <h4 className="text-white text-sm font-medium mb-3">System Throughput</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
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
              dataKey="throughput" 
              stroke="#8b5cf6" 
              fill="#8b5cf6"
              fillOpacity={0.3}
              name="Requests/min"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceCharts;