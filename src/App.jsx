import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ApiProviders from './pages/ApiProviders';
import ApiCatalog from './pages/ApiCatalog';
import ApiDetails from './pages/ApiDetails';
import CreateProvider from './pages/CreateProvider';
import CreateApi from './pages/CreateApi';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <motion.main 
            className="flex-1 ml-0 lg:ml-64 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/providers" element={<ApiProviders />} />
              <Route path="/catalog" element={<ApiCatalog />} />
              <Route path="/api/:id" element={<ApiDetails />} />
              <Route path="/create-provider" element={<CreateProvider />} />
              <Route path="/create-api" element={<CreateApi />} />
            </Routes>
          </motion.main>
        </div>
      </div>
    </Router>
  );
}

export default App;