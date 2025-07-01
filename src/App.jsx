import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import KingOverseer from './pages/KingOverseer';
import SerfFrontend from './pages/SerfFrontend';
import PeasantBackend from './pages/PeasantBackend';
import SystemArchitecture from './pages/SystemArchitecture';
import Performance from './pages/Performance';
import SecurityCompliance from './pages/SecurityCompliance';
import MultiAgentDemo from './pages/MultiAgentDemo';
import EnhancedApp from './components/EnhancedApp';

function App() {
  const [activeAgent, setActiveAgent] = useState('king');

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-royal-900 via-royal-800 to-royal-700">
        <Navigation activeAgent={activeAgent} setActiveAgent={setActiveAgent} />
        <motion.main
          className="pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<Dashboard activeAgent={activeAgent} setActiveAgent={setActiveAgent} />} />
            <Route path="/king" element={<KingOverseer />} />
            <Route path="/serf" element={<SerfFrontend />} />
            <Route path="/peasant" element={<PeasantBackend />} />
            <Route path="/architecture" element={<SystemArchitecture />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/security" element={<SecurityCompliance />} />
            <Route path="/coordination" element={<MultiAgentDemo />} />
            <Route path="/app" element={<EnhancedApp />} />
          </Routes>
        </motion.main>
      </div>
    </Router>
  );
}

export default App;