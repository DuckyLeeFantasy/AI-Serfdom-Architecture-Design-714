import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCrown, FiUsers, FiServer, FiArrowDown, FiArrowRight, FiDatabase, FiShield } = FiIcons;

const ArchitectureDiagram = () => {
  const architectureLayers = [
    {
      level: 1,
      title: 'Governance Layer',
      components: [
        { name: 'King AI Overseer', icon: FiCrown, color: 'gold', description: 'Strategic Decision Making' }
      ]
    },
    {
      level: 2,
      title: 'Service Layer',
      components: [
        { name: 'Serf Frontend Agent', icon: FiUsers, color: 'emerald', description: 'User Interface Management' }
      ]
    },
    {
      level: 3,
      title: 'Infrastructure Layer',
      components: [
        { name: 'Peasant Backend Agent', icon: FiServer, color: 'blue', description: 'Data Processing & Business Logic' }
      ]
    },
    {
      level: 4,
      title: 'Data Layer',
      components: [
        { name: 'Database Cluster', icon: FiDatabase, color: 'purple', description: 'Data Storage & Management' },
        { name: 'Security Layer', icon: FiShield, color: 'red', description: 'Authentication & Authorization' }
      ]
    }
  ];

  const communicationPaths = [
    { from: 'King', to: 'Serf', type: 'command', description: 'Task Delegation' },
    { from: 'King', to: 'Peasant', type: 'command', description: 'Resource Allocation' },
    { from: 'Serf', to: 'Peasant', type: 'request', description: 'Data Requests' },
    { from: 'Peasant', to: 'Database', type: 'query', description: 'Data Operations' },
  ];

  return (
    <div className="space-y-8">
      {/* Architecture Layers */}
      <div className="space-y-6">
        {architectureLayers.map((layer, layerIndex) => (
          <div key={layer.level} className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: layerIndex * 0.2 }}
            >
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-white mb-2">{layer.title}</h4>
                <div className="h-px bg-gradient-to-r from-royal-600 to-transparent"></div>
              </div>
              
              <div className={`grid gap-6 ${
                layer.components.length === 1 ? 'grid-cols-1 justify-center' :
                layer.components.length === 2 ? 'grid-cols-2' :
                'grid-cols-3'
              }`}>
                {layer.components.map((component, componentIndex) => (
                  <motion.div
                    key={component.name}
                    className={`bg-royal-700/40 rounded-xl p-6 border-2 border-${component.color}-500/30 hover:border-${component.color}-500/50 transition-all duration-300`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: (layerIndex * 0.2) + (componentIndex * 0.1) }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="text-center space-y-4">
                      <div className={`mx-auto w-16 h-16 rounded-full bg-${component.color}-500/20 flex items-center justify-center`}>
                        <SafeIcon icon={component.icon} className={`text-2xl text-${component.color}-400`} />
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-1">{component.name}</h5>
                        <p className="text-royal-300 text-sm">{component.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {layerIndex < architectureLayers.length - 1 && (
              <motion.div
                className="flex justify-center py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: (layerIndex * 0.2) + 0.3 }}
              >
                <SafeIcon icon={FiArrowDown} className="text-royal-400 text-2xl" />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Communication Flow */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h4 className="text-lg font-semibold text-white mb-4">Communication Flow</h4>
        <div className="space-y-3">
          {communicationPaths.map((path, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">{path.from}</span>
                <SafeIcon icon={FiArrowRight} className="text-royal-400" />
                <span className="text-white font-medium">{path.to}</span>
              </div>
              <div className="text-right">
                <p className="text-royal-300 text-sm">{path.description}</p>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  path.type === 'command' ? 'bg-gold-500/20 text-gold-400' :
                  path.type === 'request' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {path.type.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchitectureDiagram;