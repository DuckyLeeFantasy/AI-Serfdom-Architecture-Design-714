import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCrown, FiUsers, FiServer, FiLayers, FiActivity, FiHome, FiShield, FiMonitor, FiTarget } = FiIcons;

const Navigation = ({ activeAgent, setActiveAgent }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard', id: 'dashboard' },
    { path: '/king', icon: FiCrown, label: 'King AI Overseer', id: 'king' },
    { path: '/serf', icon: FiUsers, label: 'Serf Frontend', id: 'serf' },
    { path: '/peasant', icon: FiServer, label: 'Peasant Backend', id: 'peasant' },
    { path: '/coordination', icon: FiTarget, label: 'Multi-Agent Coordination', id: 'coordination' },
    { path: '/architecture', icon: FiLayers, label: 'Architecture', id: 'architecture' },
    { path: '/performance', icon: FiActivity, label: 'Performance', id: 'performance' },
    { path: '/security', icon: FiShield, label: 'Security & Compliance', id: 'security' },
    { path: '/app', icon: FiMonitor, label: 'AI-Serfdom App', id: 'app' }
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-royal-900/95 backdrop-blur-sm border-b border-gold-500/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiCrown} className="text-gold-400 text-2xl" />
            <h1 className="text-xl font-medieval font-bold text-gold-400">
              AI-Serfdom System
            </h1>
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  location.pathname === item.path
                    ? 'text-gold-400 bg-gold-400/10'
                    : 'text-royal-300 hover:text-gold-400 hover:bg-royal-800/50'
                }`}
                onClick={() => setActiveAgent(item.id)}
              >
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={item.icon} className="text-lg" />
                  <span className="text-sm font-medium hidden lg:block">{item.label}</span>
                </div>
                {location.pathname === item.path && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;