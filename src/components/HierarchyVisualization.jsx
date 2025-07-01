import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCrown, FiUsers, FiServer, FiArrowDown } = FiIcons;

const HierarchyVisualization = () => {
  const hierarchyLevels = [
    {
      level: 1,
      title: 'King AI Overseer',
      description: 'Strategic Decision Making',
      icon: FiCrown,
      color: 'gold',
      agents: 1,
      responsibilities: ['System Governance', 'Resource Allocation', 'Strategic Planning']
    },
    {
      level: 2,
      title: 'Serf Frontend Agent',
      description: 'User Interface Management',
      icon: FiUsers,
      color: 'emerald',
      agents: 1,
      responsibilities: ['User Experience', 'Interface Design', 'Personalization']
    },
    {
      level: 3,
      title: 'Peasant Backend Agent',
      description: 'Data Processing & Infrastructure',
      icon: FiServer,
      color: 'blue',
      agents: 1,
      responsibilities: ['Data Processing', 'Business Logic', 'Infrastructure']
    }
  ];

  return (
    <div className="bg-royal-800/50 backdrop-blur-sm rounded-xl p-6 border border-royal-700">
      <h2 className="text-xl font-semibold text-white mb-6">Hierarchy Structure</h2>
      <div className="space-y-6">
        {hierarchyLevels.map((level, index) => (
          <div key={level.level} className="relative">
            <motion.div
              className={`bg-royal-700/30 rounded-lg p-4 border border-${level.color}-500/30`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex items-center space-x-4 mb-3">
                <div className={`p-3 rounded-lg bg-${level.color}-500/20`}>
                  <SafeIcon icon={level.icon} className={`text-xl text-${level.color}-400`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{level.title}</h3>
                  <p className="text-royal-300 text-sm">{level.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{level.agents} Agent{level.agents > 1 ? 's' : ''}</p>
                  <p className="text-royal-400 text-xs">Level {level.level}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {level.responsibilities.map((responsibility, idx) => (
                  <span 
                    key={idx}
                    className={`px-2 py-1 text-xs font-medium rounded bg-${level.color}-500/10 text-${level.color}-400 text-center`}
                  >
                    {responsibility}
                  </span>
                ))}
              </div>
            </motion.div>
            
            {index < hierarchyLevels.length - 1 && (
              <motion.div
                className="flex justify-center py-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: (index * 0.2) + 0.3 }}
              >
                <SafeIcon icon={FiArrowDown} className="text-royal-400 text-xl" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HierarchyVisualization;