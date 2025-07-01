import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowRight, FiArrowDown, FiMessageSquare, FiSend, FiRefreshCw } = FiIcons;

const CommunicationFlow = () => {
  const communicationChannels = [
    {
      id: 1,
      name: 'Command Channel',
      type: 'Hierarchical',
      participants: ['King AI Overseer', 'Serf Frontend', 'Peasant Backend'],
      protocol: 'Request-Response',
      latency: '5ms',
      throughput: '1000 ops/s',
      status: 'active'
    },
    {
      id: 2,
      name: 'Data Channel',
      type: 'Direct',
      participants: ['Serf Frontend', 'Peasant Backend'],
      protocol: 'Streaming',
      latency: '2ms',
      throughput: '5000 ops/s',
      status: 'active'
    },
    {
      id: 3,
      name: 'Monitoring Channel',
      type: 'Broadcast',
      participants: ['All Agents', 'King AI Overseer'],
      protocol: 'Pub-Sub',
      latency: '8ms',
      throughput: '500 ops/s',
      status: 'active'
    },
    {
      id: 4,
      name: 'Emergency Channel',
      type: 'Priority',
      participants: ['All Agents'],
      protocol: 'Interrupt',
      latency: '1ms',
      throughput: '100 ops/s',
      status: 'standby'
    }
  ];

  const messageFlow = [
    {
      step: 1,
      from: 'User Interface',
      to: 'Serf Frontend',
      message: 'User Request',
      type: 'input'
    },
    {
      step: 2,
      from: 'Serf Frontend',
      to: 'King AI Overseer',
      message: 'Request Analysis',
      type: 'escalation'
    },
    {
      step: 3,
      from: 'King AI Overseer',
      to: 'Peasant Backend',
      message: 'Task Delegation',
      type: 'command'
    },
    {
      step: 4,
      from: 'Peasant Backend',
      to: 'Database',
      message: 'Data Query',
      type: 'data'
    },
    {
      step: 5,
      from: 'Database',
      to: 'Peasant Backend',
      message: 'Query Results',
      type: 'response'
    },
    {
      step: 6,
      from: 'Peasant Backend',
      to: 'Serf Frontend',
      message: 'Processed Data',
      type: 'delivery'
    },
    {
      step: 7,
      from: 'Serf Frontend',
      to: 'User Interface',
      message: 'User Response',
      type: 'output'
    }
  ];

  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'input': return 'blue';
      case 'escalation': return 'gold';
      case 'command': return 'red';
      case 'data': return 'purple';
      case 'response': return 'emerald';
      case 'delivery': return 'cyan';
      case 'output': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Communication Channels */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Communication Channels</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communicationChannels.map((channel, index) => (
            <motion.div
              key={channel.id}
              className="bg-royal-700/40 rounded-lg p-4 border border-royal-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-white font-medium">{channel.name}</h5>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  channel.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {channel.status.toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-royal-300">Type:</span>
                  <span className="text-white">{channel.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-royal-300">Protocol:</span>
                  <span className="text-white">{channel.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-royal-300">Latency:</span>
                  <span className="text-emerald-400">{channel.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-royal-300">Throughput:</span>
                  <span className="text-blue-400">{channel.throughput}</span>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-royal-300 text-xs mb-1">Participants:</p>
                <div className="flex flex-wrap gap-1">
                  {channel.participants.map((participant, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                      {participant}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Message Flow */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-4">Typical Message Flow</h4>
        <div className="space-y-3">
          {messageFlow.map((flow, index) => (
            <motion.div
              key={flow.step}
              className="flex items-center space-x-4 bg-royal-700/40 rounded-lg p-3 border border-royal-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 rounded-full">
                <span className="text-blue-400 font-bold text-sm">{flow.step}</span>
              </div>
              
              <div className="flex-1 flex items-center space-x-3">
                <span className="text-white font-medium">{flow.from}</span>
                <SafeIcon icon={FiArrowRight} className="text-royal-400" />
                <span className="text-white font-medium">{flow.to}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-royal-300 text-sm">{flow.message}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded bg-${getMessageTypeColor(flow.type)}-500/20 text-${getMessageTypeColor(flow.type)}-400`}>
                  {flow.type.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="bg-royal-700/40 rounded-lg p-6 border border-royal-600">
        <h4 className="text-lg font-semibold text-white mb-4">Communication Architecture</h4>
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
              <SafeIcon icon={FiMessageSquare} className="text-2xl text-emerald-400" />
            </div>
            <p className="text-white text-sm font-medium">User Interface</p>
          </div>
          
          <SafeIcon icon={FiArrowRight} className="text-royal-400 text-xl" />
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
              <SafeIcon icon={FiSend} className="text-2xl text-blue-400" />
            </div>
            <p className="text-white text-sm font-medium">Message Bus</p>
          </div>
          
          <SafeIcon icon={FiArrowRight} className="text-royal-400 text-xl" />
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-2">
              <SafeIcon icon={FiRefreshCw} className="text-2xl text-purple-400" />
            </div>
            <p className="text-white text-sm font-medium">Agent Network</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationFlow;