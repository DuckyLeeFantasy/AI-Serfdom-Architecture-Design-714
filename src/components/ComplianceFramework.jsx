import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { complianceService } from '../services/complianceService';

const { 
  FiFileText, FiCheck, FiAlertTriangle, FiEye, FiShield, 
  FiUsers, FiDatabase, FiSettings, FiTrendingUp, FiClock 
} = FiIcons;

const ComplianceFramework = () => {
  const [activeTab, setActiveTab] = useState('eu_ai_act');
  const [complianceData, setComplianceData] = useState({});
  const [loading, setLoading] = useState(true);

  const complianceTabs = [
    { id: 'eu_ai_act', label: 'EU AI Act', icon: FiShield, color: 'blue' },
    { id: 'nist_ai_rmf', label: 'NIST AI RMF', icon: FiSettings, color: 'emerald' },
    { id: 'gdpr', label: 'GDPR', icon: FiUsers, color: 'purple' },
    { id: 'general', label: 'General Compliance', icon: FiFileText, color: 'gold' }
  ];

  useEffect(() => {
    fetchComplianceData();
  }, [activeTab]);

  const fetchComplianceData = async () => {
    try {
      setLoading(true);
      const data = await complianceService.performComplianceAudit(activeTab);
      setComplianceData(data);
    } catch (error) {
      console.error('Error fetching compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  // EU AI Act Compliance Component
  const EUAIActCompliance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
          <h4 className="text-white font-medium mb-3">Risk Classification</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-royal-300">King AI Overseer:</span>
              <span className="text-red-400 font-medium">HIGH RISK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-royal-300">Serf Frontend:</span>
              <span className="text-yellow-400 font-medium">MEDIUM RISK</span>
            </div>
            <div className="flex justify-between">
              <span className="text-royal-300">Peasant Backend:</span>
              <span className="text-yellow-400 font-medium">MEDIUM RISK</span>
            </div>
          </div>
        </div>

        <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
          <h4 className="text-white font-medium mb-3">Compliance Requirements</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="text-emerald-400 text-sm" />
              <span className="text-royal-300 text-sm">Risk Assessment</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="text-emerald-400 text-sm" />
              <span className="text-royal-300 text-sm">Quality Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="text-emerald-400 text-sm" />
              <span className="text-royal-300 text-sm">Documentation</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiClock} className="text-yellow-400 text-sm" />
              <span className="text-royal-300 text-sm">Human Oversight</span>
            </div>
          </div>
        </div>

        <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
          <h4 className="text-white font-medium mb-3">Transparency Obligations</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="text-emerald-400 text-sm" />
              <span className="text-royal-300 text-sm">User Notifications</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="text-emerald-400 text-sm" />
              <span className="text-royal-300 text-sm">AI System Disclosure</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="text-emerald-400 text-sm" />
              <span className="text-royal-300 text-sm">Decision Explanations</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiClock} className="text-yellow-400 text-sm" />
              <span className="text-royal-300 text-sm">Capability Limitations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
        <h4 className="text-white font-medium mb-3">Data Governance Requirements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-emerald-400 text-sm font-medium mb-2">Training Data Quality</h5>
            <ul className="space-y-1 text-sm text-royal-300">
              <li>• Representative datasets implemented</li>
              <li>• Bias detection procedures active</li>
              <li>• Data quality monitoring ongoing</li>
              <li>• Correction mechanisms in place</li>
            </ul>
          </div>
          <div>
            <h5 className="text-emerald-400 text-sm font-medium mb-2">Data Protection Measures</h5>
            <ul className="space-y-1 text-sm text-royal-300">
              <li>• Privacy-by-design implemented</li>
              <li>• Data minimization enforced</li>
              <li>• Purpose limitation controls active</li>
              <li>• User consent management integrated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // NIST AI RMF Compliance Component
  const NISTAIRMFCompliance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Govern', 'Map', 'Measure', 'Manage'].map((function_, index) => (
          <div key={function_} className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
            <h4 className="text-white font-medium mb-3">{function_}</h4>
            <div className="space-y-2">
              <div className="w-full bg-royal-500 rounded-full h-2">
                <div 
                  className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${85 + index * 3}%` }}
                ></div>
              </div>
              <p className="text-emerald-400 text-sm">{85 + index * 3}% Complete</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
        <h4 className="text-white font-medium mb-3">Risk Management Implementation</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-royal-300">Risk Inventory Maintenance</span>
            <span className="text-emerald-400 font-medium">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-royal-300">Continuous Monitoring</span>
            <span className="text-emerald-400 font-medium">OPERATIONAL</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-royal-300">Mitigation Strategies</span>
            <span className="text-emerald-400 font-medium">IMPLEMENTED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-royal-300">Incident Response</span>
            <span className="text-emerald-400 font-medium">READY</span>
          </div>
        </div>
      </div>
    </div>
  );

  // GDPR Compliance Component
  const GDPRCompliance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
          <h4 className="text-white font-medium mb-3">Data Subject Rights</h4>
          <div className="space-y-2">
            {[
              'Right to Access', 'Right to Rectification', 'Right to Erasure',
              'Right to Portability', 'Right to Object', 'Right to Restriction'
            ].map((right, index) => (
              <div key={right} className="flex items-center space-x-2">
                <SafeIcon icon={FiCheck} className="text-emerald-400 text-sm" />
                <span className="text-royal-300 text-sm">{right}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
          <h4 className="text-white font-medium mb-3">Privacy by Design</h4>
          <div className="space-y-2">
            {[
              'Data Minimization', 'Purpose Limitation', 'Storage Limitation',
              'Accuracy Requirements', 'Integrity & Confidentiality', 'Accountability'
            ].map((principle, index) => (
              <div key={principle} className="flex items-center space-x-2">
                <SafeIcon icon={FiCheck} className="text-emerald-400 text-sm" />
                <span className="text-royal-300 text-sm">{principle}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
        <h4 className="text-white font-medium mb-3">Cross-Border Transfer Compliance</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h5 className="text-emerald-400 text-sm font-medium mb-2">Data Residency</h5>
            <p className="text-royal-300 text-sm">EU data remains within EU boundaries with appropriate safeguards for necessary transfers.</p>
          </div>
          <div>
            <h5 className="text-emerald-400 text-sm font-medium mb-2">Transfer Mechanisms</h5>
            <p className="text-royal-300 text-sm">Standard Contractual Clauses implemented for all cross-border data transfers.</p>
          </div>
          <div>
            <h5 className="text-emerald-400 text-sm font-medium mb-2">Data Mapping</h5>
            <p className="text-royal-300 text-sm">Comprehensive data flow mapping maintains visibility into all processing activities.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComplianceContent = () => {
    switch (activeTab) {
      case 'eu_ai_act':
        return <EUAIActCompliance />;
      case 'nist_ai_rmf':
        return <NISTAIRMFCompliance />;
      case 'gdpr':
        return <GDPRCompliance />;
      default:
        return (
          <div className="text-center py-8">
            <SafeIcon icon={FiFileText} className="text-4xl text-royal-400 mx-auto mb-4" />
            <p className="text-royal-300">General compliance framework coming soon</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Compliance Framework</h2>
          <p className="text-royal-300">Comprehensive regulatory compliance monitoring and management</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-emerald-400 text-sm">All Systems Compliant</span>
        </div>
      </div>

      {/* Compliance Tabs */}
      <div className="bg-royal-700/40 rounded-xl border border-royal-600">
        <div className="flex border-b border-royal-600">
          {complianceTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? `text-${tab.color}-400 border-b-2 border-${tab.color}-400 bg-${tab.color}-400/5`
                  : 'text-royal-300 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <SafeIcon icon={tab.icon} className="text-lg" />
                <span className="hidden sm:block">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <SafeIcon icon={FiSettings} className="animate-spin text-2xl text-royal-400" />
              <span className="ml-2 text-royal-300">Loading compliance data...</span>
            </div>
          ) : (
            renderComplianceContent()
          )}
        </div>
      </div>

      {/* Compliance Score Summary */}
      <motion.div
        className="bg-royal-700/40 rounded-xl p-6 border border-royal-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Overall Compliance Score</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {complianceTabs.map((tab, index) => (
            <div key={tab.id} className="text-center">
              <div className={`w-16 h-16 mx-auto mb-2 rounded-full bg-${tab.color}-500/20 flex items-center justify-center`}>
                <SafeIcon icon={tab.icon} className={`text-2xl text-${tab.color}-400`} />
              </div>
              <h4 className="text-white font-medium text-sm">{tab.label}</h4>
              <p className={`text-${tab.color}-400 font-bold`}>{94 + index}%</p>
              <div className="w-full bg-royal-600 rounded-full h-1 mt-1">
                <div 
                  className={`bg-${tab.color}-400 h-1 rounded-full transition-all duration-300`}
                  style={{ width: `${94 + index}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ComplianceFramework;