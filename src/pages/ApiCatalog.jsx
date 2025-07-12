import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiSearch, FiFilter, FiEye, FiEdit, FiTrash2 } = FiIcons;

const ApiCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Todas' },
    { value: 'payment', label: 'Pagamentos' },
    { value: 'user', label: 'Usuários' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'notification', label: 'Notificações' }
  ];

  const apis = [
    {
      id: 1,
      name: 'User Management API',
      provider: 'TechCorp Solutions',
      version: 'v2.1',
      category: 'user',
      description: 'API completa para gerenciamento de usuários, autenticação e autorização',
      endpoints: 15,
      status: 'Ativo',
      lastUpdate: '2024-03-15'
    },
    {
      id: 2,
      name: 'Payment Gateway API',
      provider: 'PayFlow Systems',
      version: 'v1.8',
      category: 'payment',
      description: 'Processamento de pagamentos com suporte a múltiplos métodos',
      endpoints: 12,
      status: 'Ativo',
      lastUpdate: '2024-03-10'
    },
    {
      id: 3,
      name: 'Analytics Dashboard API',
      provider: 'DataLabs Analytics',
      version: 'v3.0',
      category: 'analytics',
      description: 'Coleta e análise de dados em tempo real',
      endpoints: 20,
      status: 'Beta',
      lastUpdate: '2024-03-20'
    },
    {
      id: 4,
      name: 'Notification Service API',
      provider: 'NotifyMe Services',
      version: 'v1.5',
      category: 'notification',
      description: 'Serviço de notificações push, email e SMS',
      endpoints: 8,
      status: 'Ativo',
      lastUpdate: '2024-03-12'
    }
  ];

  const filteredApis = apis.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         api.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || api.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 
          className="text-3xl font-bold text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Catálogo de APIs
        </motion.h1>
        <Link
          to="/create-api"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Nova API</span>
        </Link>
      </div>

      <motion.div 
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="relative flex-1">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar APIs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApis.map((api, index) => (
            <motion.div
              key={api.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{api.name}</h3>
                  <p className="text-sm text-gray-600">{api.provider}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  api.status === 'Ativo' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {api.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{api.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">v{api.version}</span>
                  <span className="text-sm text-gray-500">{api.endpoints} endpoints</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Atualizado em {api.lastUpdate}
                </span>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/api/${api.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                  </Link>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ApiCatalog;