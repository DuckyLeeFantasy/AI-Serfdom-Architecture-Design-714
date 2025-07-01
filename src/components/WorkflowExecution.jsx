import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlay, FiPause, FiCheck, FiClock, FiAlertTriangle, FiSettings, FiGitBranch } = FiIcons;

const WorkflowExecution = () => {
  const workflowMetrics = [
    { label: 'Active Workflows', value: '23', change: '+3', icon: FiPlay, color: 'emerald' },
    { label: 'Completed Today', value: '147', change: '+12', icon: FiCheck, color: 'blue' },
    { label: 'Success Rate', value: '98.7%', change: '+0.3%', icon: FiSettings, color: 'gold' },
    { label: 'Avg Duration', value: '2.3s', change: '-0.2s', icon: FiClock, color: 'purple' },
  ];

  const activeWorkflows = [
    {
      id: 'wf-001',
      name: 'User Data Processing',
      status: 'running',
      progress: 75,
      stage: 'Data Validation',
      startTime: '14:23:15',
      eta: '2 minutes'
    },
    {
      id: 'wf-002',
      name: 'System Health Check',
      status: 'running',
      progress: 45,
      stage: 'Resource Monitoring',
      startTime: '14:25:32',
      eta: '3 minutes'
    },
    {
      id: 'wf-003',
      name: 'Database Optimization',
      status: 'paused',
      progress: 30,
      stage: 'Index Rebuilding',
      startTime: '14:20:08',
      eta: 'Paused'
    },
    {
      id: 'wf-004',
      name: 'Backup Synchronization',
      status: 'queued',
      progress: 0,
      stage: 'Pending',
      startTime: 'N/A',
      eta: 'Waiting'
    },
  ];

  const workflowTemplates = [
    {
      id: 'tpl-001',
      name: 'Data Processing Pipeline',
      description: 'Complete data ingestion, validation, and storage workflow',
      stages: 5,
      avgDuration: '3.2s',
      successRate: 99.1,
      executions: 1247
    },
    {
      id: 'tpl-002',
      name: 'System Maintenance',
      description: 'Automated system health checks and optimization tasks',
      stages: 8,
      avgDuration: '12.5s',
      successRate: 97.8,
      executions: 342
    },
    {
      id: 'tpl-003',
      name: 'User Onboarding',
      description: 'New user registration and initial setup workflow',
      stages: 4,
      avgDuration: '1.8s',
      successRate: 98.9,
      executions: 892
    },
    {
      id: 'tpl-004',
      name: 'Error Recovery',
      description: 'Automated error detection and recovery procedures',
      stages: 6,
      avgDuration: '5.7s',
      successRate: 94.3,
      executions: 156
    },
  ];

  const workflowHistory = [
    {
      id: 'hist-001',
      workflow: 'Data Processing Pipeline',
      status: 'completed',
      duration: '2.8s',
      timestamp: '14:20:45',
      result: 'Success - 1,247 records processed'
    },
    {
      id: 'hist-002',
      workflow: 'System Health Check',
      status: 'completed',
      duration: '11.2s',
      timestamp: '14:15:23',
      result: 'Success - All systems operational'
    },
    {
      id: 'hist-003',
      workflow: 'User Onboarding',
      status: 'failed',
      duration: '0.9s',
      timestamp: '14:12:18',
      result: 'Error - Email validation failed'
    },
    {
      id: 'hist-004',
      workflow: 'Database Optimization',
      status: 'completed',
      duration: '45.3s',
      timestamp: '14:05:12',
      result: 'Success - Performance improved by 15%'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Workflow Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {workflowMetrics.map((metric, index) => (
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
                  metric.change.startsWith('+') ? 'text-emerald-400' :
                  metric.change.startsWith('-') && metric.label === 'Avg Duration' ? 'text-emerald-400' :
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

      {/* Active Workflows */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Active Workflows</h3>
        <div className="space-y-3">
          {activeWorkflows.map((workflow, index) => (
            <motion.div
              key={workflow.id}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    workflow.status === 'running' ? 'bg-emerald-400 animate-pulse' :
                    workflow.status === 'paused' ? 'bg-yellow-400' :
                    workflow.status === 'queued' ? 'bg-gray-400' :
                    'bg-red-400'
                  }`}></div>
                  <div>
                    <h4 className="text-white font-medium">{workflow.name}</h4>
                    <p className="text-royal-300 text-sm">{workflow.id} • Started: {workflow.startTime}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-royal-300 text-sm">ETA: {workflow.eta}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    workflow.status === 'running' ? 'bg-emerald-500/20 text-emerald-400' :
                    workflow.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                    workflow.status === 'queued' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {workflow.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-royal-300 text-sm">Current Stage: {workflow.stage}</span>
                  <span className="text-white text-sm">{workflow.progress}%</span>
                </div>
                <div className="w-full bg-royal-500 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      workflow.status === 'running' ? 'bg-emerald-400' :
                      workflow.status === 'paused' ? 'bg-yellow-400' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${workflow.progress}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Workflow Templates */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiGitBranch} className="text-blue-400" />
          <span>Workflow Templates</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflowTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{template.name}</h4>
                <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded">
                  {template.stages} STAGES
                </span>
              </div>
              
              <p className="text-royal-300 text-sm mb-3">{template.description}</p>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-royal-400">Avg Duration</p>
                  <p className="text-white font-medium">{template.avgDuration}</p>
                </div>
                <div>
                  <p className="text-royal-400">Success Rate</p>
                  <p className="text-emerald-400 font-medium">{template.successRate}%</p>
                </div>
                <div>
                  <p className="text-royal-400">Executions</p>
                  <p className="text-white font-medium">{template.executions.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Workflow History */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Executions</h3>
        <div className="space-y-3">
          {workflowHistory.map((execution, index) => (
            <motion.div
              key={execution.id}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <SafeIcon icon={
                    execution.status === 'completed' ? FiCheck :
                    execution.status === 'failed' ? FiAlertTriangle :
                    FiClock
                  } className={`text-sm ${
                    execution.status === 'completed' ? 'text-emerald-400' :
                    execution.status === 'failed' ? 'text-red-400' :
                    'text-yellow-400'
                  }`} />
                  <h4 className="text-white font-medium">{execution.workflow}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-royal-300 text-sm">{execution.duration}</span>
                  <span className="text-royal-400 text-xs">{execution.timestamp}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    execution.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    execution.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {execution.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="text-royal-300 text-sm">{execution.result}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowExecution;