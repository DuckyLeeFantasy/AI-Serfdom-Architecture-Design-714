import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiBrain, FiCheckCircle, FiClock, FiTrendingUp, FiSettings } = FiIcons;

const DecisionEngine = () => {
  const decisionTypes = [
    { type: 'Resource Allocation', count: 45, accuracy: 98.7, avgTime: '0.3s' },
    { type: 'Task Delegation', count: 32, accuracy: 97.2, avgTime: '0.5s' },
    { type: 'System Optimization', count: 28, accuracy: 99.1, avgTime: '1.2s' },
    { type: 'Risk Assessment', count: 15, accuracy: 96.8, avgTime: '2.1s' },
  ];

  const recentDecisions = [
    {
      id: 1,
      decision: 'Allocate additional processing power to backend',
      reasoning: 'Detected 15% increase in data processing requests',
      outcome: 'Response time improved by 23%',
      confidence: 95
    },
    {
      id: 2,
      decision: 'Delegate UI optimization to Serf Frontend',
      reasoning: 'User satisfaction metrics dropped below threshold',
      outcome: 'Task assigned and in progress',
      confidence: 92
    },
    {
      id: 3,
      decision: 'Initiate database maintenance window',
      reasoning: 'Query performance degraded by 8% over 24 hours',
      outcome: 'Maintenance scheduled for 2 AM',
      confidence: 88
    },
  ];

  return (
    <div className="space-y-6">
      {/* Decision Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {decisionTypes.map((type, index) => (
          <motion.div
            key={type.type}
            className="bg-royal-700/30 rounded-lg p-4 border border-royal-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="text-center space-y-2">
              <p className="text-gold-400 text-sm font-medium">{type.type}</p>
              <p className="text-2xl font-bold text-white">{type.count}</p>
              <div className="space-y-1">
                <p className="text-emerald-400 text-xs">{type.accuracy}% accuracy</p>
                <p className="text-royal-300 text-xs">{type.avgTime} avg</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Decision Process */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiBrain} className="text-gold-400" />
          <span>Decision Process Framework</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-400 font-bold">1</span>
            </div>
            <p className="text-white text-sm font-medium">Data Analysis</p>
            <p className="text-royal-300 text-xs">Collect and analyze system metrics</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-emerald-400 font-bold">2</span>
            </div>
            <p className="text-white text-sm font-medium">Pattern Recognition</p>
            <p className="text-royal-300 text-xs">Identify trends and anomalies</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-gold-400 font-bold">3</span>
            </div>
            <p className="text-white text-sm font-medium">Decision Making</p>
            <p className="text-royal-300 text-xs">Apply rules and ML models</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-400 font-bold">4</span>
            </div>
            <p className="text-white text-sm font-medium">Execution</p>
            <p className="text-royal-300 text-xs">Implement and monitor results</p>
          </div>
        </div>
      </div>

      {/* Recent Decisions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Recent Decisions</h3>
        {recentDecisions.map((decision, index) => (
          <motion.div
            key={decision.id}
            className="bg-royal-700/30 rounded-lg p-4 border border-royal-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-white font-medium">{decision.decision}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400 text-sm">{decision.confidence}%</span>
                <SafeIcon icon={FiCheckCircle} className="text-emerald-400 text-sm" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="text-royal-300 text-sm"><strong>Reasoning:</strong> {decision.reasoning}</p>
              </div>
              <div>
                <p className="text-royal-300 text-sm"><strong>Outcome:</strong> {decision.outcome}</p>
              </div>
            </div>
            
            <div className="mt-3 w-full bg-royal-600 rounded-full h-2">
              <div 
                className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${decision.confidence}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DecisionEngine;