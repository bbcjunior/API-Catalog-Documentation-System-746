import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiUsers, FiBookOpen, FiPlus, FiX } = FiIcons;

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/providers', label: 'Provedores', icon: FiUsers },
    { path: '/catalog', label: 'Catálogo de APIs', icon: FiBookOpen },
    { path: '/create-provider', label: 'Novo Provedor', icon: FiPlus },
    { path: '/create-api', label: 'Nova API', icon: FiPlus }
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <motion.aside 
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-6 border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
              <SafeIcon icon={FiX} className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <nav className="mt-8 px-6">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <motion.li 
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={onClose}
                >
                  <SafeIcon icon={item.icon} className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;