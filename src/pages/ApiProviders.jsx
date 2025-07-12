import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiPlus, FiSearch, FiEdit, FiTrash2, FiExternalLink } = FiIcons;

const ApiProviders = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const providers = [
    {
      id: 1,
      name: 'TechCorp Solutions',
      email: 'api@techcorp.com',
      website: 'https://techcorp.com',
      apis: 12,
      status: 'Ativo',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'PayFlow Systems',
      email: 'dev@payflow.io',
      website: 'https://payflow.io',
      apis: 8,
      status: 'Ativo',
      createdAt: '2024-02-20'
    },
    {
      id: 3,
      name: 'DataLabs Analytics',
      email: 'apis@datalabs.com',
      website: 'https://datalabs.com',
      apis: 15,
      status: 'Pendente',
      createdAt: '2024-03-10'
    },
    {
      id: 4,
      name: 'NotifyMe Services',
      email: 'contact@notifyme.app',
      website: 'https://notifyme.app',
      apis: 6,
      status: 'Ativo',
      createdAt: '2024-01-30'
    }
  ];

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1 
          className="text-3xl font-bold text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Provedores de API
        </motion.h1>
        <Link
          to="/create-provider"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Novo Provedor</span>
        </Link>
      </div>

      <motion.div 
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar provedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Nome</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Website</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">APIs</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Criado em</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.map((provider, index) => (
                <motion.tr 
                  key={provider.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{provider.name}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{provider.email}</td>
                  <td className="py-4 px-4">
                    <a 
                      href={provider.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <span>Ver site</span>
                      <SafeIcon icon={FiExternalLink} className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      {provider.apis}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      provider.status === 'Ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {provider.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{provider.createdAt}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <SafeIcon icon={FiEdit} className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ApiProviders;