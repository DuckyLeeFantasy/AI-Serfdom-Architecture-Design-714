import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { governanceService } from '../services/governanceService';

const { 
  FiUsers, FiFileText, FiShield, FiTrendingUp, FiSettings, 
  FiCheck, FiAlertTriangle, FiClock, FiTarget, FiEye 
} = FiIcons;

const GovernanceDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [governanceData, setGovernanceData] = useState({});
  const [loading, setLoading] = useState(true);

  const governanceSections = [
    { id: 'overview', label: 'Overview', icon: FiTrendingUp },
    { id: 'committee', label: 'AI Committee', icon: FiUsers },
    { id: 'policies', label: 'Policies', icon: FiFileText },
    { id: 'risk', label: 'Risk Management', icon: FiShield },
    { id: 'stakeholders', label: 'Stakeholders', icon: FiTarget }
  ];

  useEffect(() => {
    fetchGovernanceData();
  }, []);

  const fetchGovernanceData = async () => {
    try {
      setLoading(true);
      const data = await governanceService.generateGovernanceReport('comprehensive', '30d');
      setGovernanceData(data);
    } catch (error) {
      console.error('Error fetching governance data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Overview Section
  const OverviewSection = () => (
    <div className="space-y-6">
      {/* Governance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-royal-400 text-sm">Active Policies</p>
              <p className="text-2xl font-bold text-white">24</p>
            </div>
            <SafeIcon icon={FiFileText} className="text-blue-400 text-2xl" />
          </div>
        </div>

        <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-royal-400 text-sm">Risk Assessments</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
            <SafeIcon icon={FiShield} className="text-emerald-400 text-2xl" />
          </div>
        </div>

        <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-royal-400 text-sm">Committee Meetings</p>
              <p className="text-2xl font-bold text-white">8</p>
            </div>
            <SafeIcon icon={FiUsers} className="text-purple-400 text-2xl" />
          </div>
        </div>

        <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-royal-400 text-sm">Compliance Score</p>
              <p className="text-2xl font-bold text-emerald-400">96%</p>
            </div>
            <SafeIcon icon={FiCheck} className="text-emerald-400 text-2xl" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
        <h4 className="text-white font-medium mb-4">Recent Governance Activities</h4>
        <div className="space-y-3">
          {[
            { action: 'Policy Review Completed', item: 'AI Development Standards', date: '2024-01-15', status: 'completed' },
            { action: 'Risk Assessment', item: 'King AI Overseer System', date: '2024-01-14', status: 'in_progress' },
            { action: 'Committee Meeting', item: 'Monthly Governance Review', date: '2024-01-12', status: 'completed' },
            { action: 'Stakeholder Consultation', item: 'Ethics Framework Update', date: '2024-01-10', status: 'scheduled' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-royal-500 last:border-b-0">
              <div>
                <p className="text-white text-sm font-medium">{activity.action}</p>
                <p className="text-royal-300 text-xs">{activity.item}</p>
              </div>
              <div className="text-right">
                <p className="text-royal-400 text-xs">{activity.date}</p>
                <span className={`px-2 py-1 text-xs rounded ${
                  activity.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                  activity.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {activity.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Committee Section
  const CommitteeSection = () => (
    <div className="space-y-6">
      {/* Committee Structure */}
      <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
        <h4 className="text-white font-medium mb-4">AI Governance Committee Structure</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { role: 'Executive Leadership', title: 'Chief Technology Officer', focus: 'Strategic Alignment' },
            { role: 'Technical Expert', title: 'AI Research Director', focus: 'Technical Feasibility' },
            { role: 'Legal Counsel', title: 'Chief Legal Officer', focus: 'Regulatory Compliance' },
            { role: 'Ethics Expert', title: 'Ethics & AI Advisor', focus: 'Ethical Impact' },
            { role: 'Business Representative', title: 'Business Unit Leaders', focus: 'Operational Impact' }
          ].map((member, index) => (
            <div key={index} className="bg-royal-500/30 rounded-lg p-3 border border-royal-400">
              <h5 className="text-white font-medium text-sm">{member.role}</h5>
              <p className="text-royal-300 text-xs">{member.title}</p>
              <p className="text-blue-400 text-xs mt-1">{member.focus}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Committee Charter */}
      <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
        <h4 className="text-white font-medium mb-4">Committee Charter & Responsibilities</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-emerald-400 text-sm font-medium mb-2">Mission</h5>
            <p className="text-royal-300 text-sm mb-4">
              Ensure responsible AI development, deployment, and operation across the organization while 
              maintaining alignment with business objectives and regulatory requirements.
            </p>
            <h5 className="text-emerald-400 text-sm font-medium mb-2">Authority</h5>
            <ul className="text-royal-300 text-sm space-y-1">
              <li>• Policy development and approval</li>
              <li>• Risk assessment oversight</li>
              <li>• Incident investigation</li>
              <li>• Strategic guidance provision</li>
            </ul>
          </div>
          <div>
            <h5 className="text-emerald-400 text-sm font-medium mb-2">Key Responsibilities</h5>
            <ul className="text-royal-300 text-sm space-y-1">
              <li>• Review and approve AI policies</li>
              <li>• Oversee high-risk AI deployments</li>
              <li>• Monitor compliance and performance</li>
              <li>• Investigate AI-related incidents</li>
              <li>• Provide guidance on emerging technologies</li>
              <li>• Engage with stakeholders</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // Policies Section
  const PoliciesSection = () => (
    <div className="space-y-6">
      {/* Policy Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { category: 'AI Development', count: 8, updated: '2024-01-15', status: 'current' },
          { category: 'Data Governance', count: 6, updated: '2024-01-12', status: 'current' },
          { category: 'Security', count: 5, updated: '2024-01-10', status: 'current' },
          { category: 'Ethics', count: 3, updated: '2024-01-08', status: 'review_needed' },
          { category: 'Compliance', count: 2, updated: '2024-01-05', status: 'current' }
        ].map((category, index) => (
          <div key={index} className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-white font-medium">{category.category}</h5>
              <span className={`px-2 py-1 text-xs rounded ${
                category.status === 'current' ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {category.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <p className="text-royal-300 text-sm">{category.count} active policies</p>
            <p className="text-royal-400 text-xs">Last updated: {category.updated}</p>
          </div>
        ))}
      </div>

      {/* Policy Development Process */}
      <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
        <h4 className="text-white font-medium mb-4">Policy Development Process</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: 1, phase: 'Identification', description: 'Identify policy needs and requirements' },
            { step: 2, phase: 'Development', description: 'Draft policy with stakeholder input' },
            { step: 3, phase: 'Review', description: 'Committee review and approval' },
            { step: 4, phase: 'Implementation', description: 'Deploy and communicate policy' }
          ].map((process, index) => (
            <div key={index} className="text-center">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-400 font-bold text-sm">{process.step}</span>
              </div>
              <h5 className="text-white text-sm font-medium">{process.phase}</h5>
              <p className="text-royal-300 text-xs mt-1">{process.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Risk Management Section
  const RiskManagementSection = () => (
    <div className="space-y-6">
      {/* Risk Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
          <h4 className="text-white font-medium mb-4">Risk Categories</h4>
          <div className="space-y-3">
            {[
              { category: 'Technical Risks', level: 'Medium', count: 8 },
              { category: 'Ethical Risks', level: 'Low', count: 3 },
              { category: 'Business Risks', level: 'Medium', count: 5 },
              { category: 'Regulatory Risks', level: 'Low', count: 2 }
            ].map((risk, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-royal-300">{risk.category}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm">{risk.count} risks</span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    risk.level === 'High' ? 'bg-red-500/20 text-red-400' :
                    risk.level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {risk.level.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
          <h4 className="text-white font-medium mb-4">Mitigation Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-royal-300">Risks Identified</span>
              <span className="text-white font-medium">18</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-royal-300">Mitigation Strategies</span>
              <span className="text-emerald-400 font-medium">16</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-royal-300">Implementation Complete</span>
              <span className="text-emerald-400 font-medium">14</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-royal-300">Monitoring Active</span>
              <span className="text-blue-400 font-medium">18</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment Timeline */}
      <div className="bg-royal-600/30 rounded-lg p-4 border border-royal-500">
        <h4 className="text-white font-medium mb-4">Recent Risk Assessments</h4>
        <div className="space-y-3">
          {[
            { system: 'King AI Overseer', date: '2024-01-15', level: 'High', status: 'Completed' },
            { system: 'Serf Frontend Agent', date: '2024-01-12', level: 'Medium', status: 'In Progress' },
            { system: 'Peasant Backend Agent', date: '2024-01-10', level: 'Medium', status: 'Scheduled' },
            { system: 'Communication Layer', date: '2024-01-08', level: 'Low', status: 'Completed' }
          ].map((assessment, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-royal-500 last:border-b-0">
              <div>
                <p className="text-white text-sm font-medium">{assessment.system}</p>
                <p className="text-royal-400 text-xs">{assessment.date}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded ${
                  assessment.level === 'High' ? 'bg-red-500/20 text-red-400' :
                  assessment.level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {assessment.level.toUpperCase()}
                </span>
                <span className={`px-2 py-1 text-xs rounded ${
                  assessment.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                  assessment.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {assessment.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'committee':
        return <CommitteeSection />;
      case 'policies':
        return <PoliciesSection />;
      case 'risk':
        return <RiskManagementSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">AI Governance Dashboard</h2>
          <p className="text-royal-300">Comprehensive governance oversight and management</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-emerald-400 text-sm">Governance Active</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-royal-700/40 rounded-xl border border-royal-600">
        <div className="flex overflow-x-auto">
          {governanceSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5'
                  : 'text-royal-300 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <SafeIcon icon={section.icon} className="text-lg" />
                <span>{section.label}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <SafeIcon icon={FiSettings} className="animate-spin text-2xl text-royal-400" />
              <span className="ml-2 text-royal-300">Loading governance data...</span>
            </div>
          ) : (
            renderSectionContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default GovernanceDashboard;