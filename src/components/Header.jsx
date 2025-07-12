import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMenu, FiSearch, FiBell, FiUser } = FiIcons;

const Header = ({ onMenuClick }) => {
  return (
    <motion.header 
      className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <SafeIcon icon={FiMenu} className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">API</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">API Gateway</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar APIs..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
          <SafeIcon icon={FiBell} className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </motion.header>
  );
};

export default Header;