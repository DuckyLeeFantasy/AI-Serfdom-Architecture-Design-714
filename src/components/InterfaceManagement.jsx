import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMonitor, FiSmartphone, FiTablet, FiLayout, FiPalette, FiSettings } = FiIcons;

const InterfaceManagement = () => {
  const deviceMetrics = [
    { device: 'Desktop', users: '892', percentage: 58, icon: FiMonitor, color: 'blue' },
    { device: 'Mobile', users: '487', percentage: 32, icon: FiSmartphone, color: 'emerald' },
    { device: 'Tablet', users: '164', percentage: 10, icon: FiTablet, color: 'purple' },
  ];

  const interfaceComponents = [
    {
      id: 1,
      name: 'Navigation Menu',
      status: 'optimized',
      performance: 95,
      lastUpdate: '2 hours ago',
      issues: 0
    },
    {
      id: 2,
      name: 'Dashboard Layout',
      status: 'good',
      performance: 88,
      lastUpdate: '4 hours ago',
      issues: 1
    },
    {
      id: 3,
      name: 'Form Components',
      status: 'needs-attention',
      performance: 76,
      lastUpdate: '6 hours ago',
      issues: 3
    },
    {
      id: 4,
      name: 'Data Visualization',
      status: 'optimized',
      performance: 92,
      lastUpdate: '1 hour ago',
      issues: 0
    },
  ];

  const designSystem = [
    {
      category: 'Colors',
      items: ['Primary Palette', 'Secondary Colors', 'Status Colors', 'Neutral Tones'],
      status: 'updated',
      version: '2.1.0'
    },
    {
      category: 'Typography',
      items: ['Headings', 'Body Text', 'Captions', 'Code Text'],
      status: 'stable',
      version: '2.0.0'
    },
    {
      category: 'Components',
      items: ['Buttons', 'Forms', 'Cards', 'Modals'],
      status: 'updated',
      version: '2.1.2'
    },
    {
      category: 'Layout',
      items: ['Grid System', 'Spacing', 'Breakpoints', 'Containers'],
      status: 'stable',
      version: '2.0.0'
    },
  ];

  const recentUpdates = [
    {
      id: 1,
      type: 'Component Update',
      description: 'Enhanced button component with better accessibility',
      impact: 'Improved keyboard navigation for all users',
      timestamp: '1 hour ago'
    },
    {
      id: 2,
      type: 'Layout Optimization',
      description: 'Optimized grid system for better mobile responsiveness',
      impact: 'Reduced layout shift on mobile devices',
      timestamp: '3 hours ago'
    },
    {
      id: 3,
      type: 'Performance Enhancement',
      description: 'Implemented lazy loading for dashboard components',
      impact: 'Reduced initial page load time by 30%',
      timestamp: '5 hours ago'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Device Usage */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Device Usage Distribution</h3>
        <div className="space-y-4">
          {deviceMetrics.map((device, index) => (
            <motion.div
              key={device.device}
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-${device.color}-500/20`}>
                  <SafeIcon icon={device.icon} className={`text-lg text-${device.color}-400`} />
                </div>
                <div>
                  <p className="text-white font-medium">{device.device}</p>
                  <p className="text-royal-300 text-sm">{device.users} users</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-royal-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-${device.color}-400 transition-all duration-300`}
                    style={{ width: `${device.percentage}%` }}
                  ></div>
                </div>
                <span className="text-white font-medium w-8">{device.percentage}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interface Components */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Interface Components Status</h3>
        <div className="space-y-3">
          {interfaceComponents.map((component, index) => (
            <motion.div
              key={component.id}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">{component.name}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    component.status === 'optimized' ? 'bg-emerald-500/20 text-emerald-400' :
                    component.status === 'good' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {component.status.toUpperCase()}
                  </span>
                  {component.issues > 0 && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded">
                      {component.issues} ISSUE{component.issues > 1 ? 'S' : ''}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-royal-300">Performance</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-royal-500 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${
                          component.performance >= 90 ? 'bg-emerald-400' :
                          component.performance >= 80 ? 'bg-blue-400' :
                          'bg-yellow-400'
                        }`}
                        style={{ width: `${component.performance}%` }}
                      ></div>
                    </div>
                    <span className="text-white font-medium">{component.performance}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-royal-300">Last Update</p>
                  <p className="text-white font-medium">{component.lastUpdate}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Design System */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <SafeIcon icon={FiPalette} className="text-emerald-400" />
          <span>Design System</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {designSystem.map((category, index) => (
            <motion.div
              key={category.category}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">{category.category}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    category.status === 'updated' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {category.status.toUpperCase()}
                  </span>
                  <span className="text-royal-300 text-xs">v{category.version}</span>
                </div>
              </div>
              <div className="space-y-1">
                {category.items.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-royal-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-royal-700/30 rounded-lg p-4 border border-royal-600">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Interface Updates</h3>
        <div className="space-y-3">
          {recentUpdates.map((update, index) => (
            <motion.div
              key={update.id}
              className="bg-royal-600/30 rounded-lg p-3 border border-royal-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded">
                    {update.type}
                  </span>
                  <span className="text-royal-400 text-xs">{update.timestamp}</span>
                </div>
              </div>
              <h4 className="text-white font-medium mb-1">{update.description}</h4>
              <p className="text-emerald-400 text-sm">{update.impact}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterfaceManagement;