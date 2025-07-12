import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUsers, FiBookOpen, FiActivity, FiTrendingUp, FiPlus } = FiIcons;

const Dashboard = () => {
  const stats = [
    { label: 'Provedores Ativos', value: '24', icon: FiUsers, color: 'bg-blue-500' },
    { label: 'APIs Catalogadas', value: '156', icon: FiBookOpen, color: 'bg-green-500' },
    { label: 'Requisições/Dia', value: '12.5K', icon: FiActivity, color: 'bg-purple-500' },
    { label: 'Taxa de Sucesso', value: '99.2%', icon: FiTrendingUp, color: 'bg-orange-500' }
  ];

  const recentApis = [
    { name: 'User Management API', provider: 'TechCorp', version: 'v2.1', status: 'Ativo' },
    { name: 'Payment Gateway API', provider: 'PayFlow', version: 'v1.8', status: 'Ativo' },
    { name: 'Analytics API', provider: 'DataLabs', version: 'v3.0', status: 'Beta' },
    { name: 'Notification Service', provider: 'NotifyMe', version: 'v1.5', status: 'Ativo' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 
          className="text-3xl font-bold text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Dashboard
        </motion.h1>
        <Link
          to="/create-api"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Nova API</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">APIs Recentes</h2>
          <div className="space-y-3">
            {recentApis.map((api, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{api.name}</p>
                  <p className="text-sm text-gray-600">{api.provider} • {api.version}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  api.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {api.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <Link
              to="/create-provider"
              className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <SafeIcon icon={FiUsers} className="w-5 h-5 text-blue-600" />
              <span className="text-blue-900 font-medium">Cadastrar Provedor</span>
            </Link>
            <Link
              to="/create-api"
              className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <SafeIcon icon={FiBookOpen} className="w-5 h-5 text-green-600" />
              <span className="text-green-900 font-medium">Catalogar Nova API</span>
            </Link>
            <Link
              to="/catalog"
              className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <SafeIcon icon={FiActivity} className="w-5 h-5 text-purple-600" />
              <span className="text-purple-900 font-medium">Ver Catálogo</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;