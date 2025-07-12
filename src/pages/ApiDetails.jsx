import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowLeft, FiExternalLink, FiCode, FiBook, FiSettings } = FiIcons;

const ApiDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const api = {
    id: 1,
    name: 'User Management API',
    provider: 'TechCorp Solutions',
    version: 'v2.1',
    description: 'API completa para gerenciamento de usuários, autenticação e autorização com suporte a múltiplos provedores de identidade.',
    baseUrl: 'https://api.techcorp.com/v2',
    status: 'Ativo',
    documentation: 'https://docs.techcorp.com/api',
    endpoints: [
      {
        id: 1,
        method: 'POST',
        path: '/users',
        description: 'Criar novo usuário',
        requestSchema: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: { type: 'string', maxLength: 255, format: 'email' },
            password: { type: 'string', maxLength: 128 },
            name: { type: 'string', maxLength: 100 },
            roles: { 
              type: 'array', 
              maxItems: 10,
              items: { type: 'string', maxLength: 50 }
            },
            profile: {
              type: 'object',
              properties: {
                avatar: { type: 'string', maxLength: 500 },
                bio: { type: 'string', maxLength: 1000 },
                preferences: {
                  type: 'object',
                  properties: {
                    theme: { type: 'string', enum: ['light', 'dark'], maxLength: 10 },
                    notifications: { type: 'boolean' }
                  }
                }
              }
            }
          }
        },
        responseSchema: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', maxLength: 255 },
            name: { type: 'string', maxLength: 100 },
            createdAt: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['active', 'inactive'] }
          }
        }
      },
      {
        id: 2,
        method: 'GET',
        path: '/users',
        description: 'Listar usuários',
        requestSchema: {
          type: 'object',
          properties: {
            page: { type: 'integer', minimum: 1, maximum: 1000 },
            limit: { type: 'integer', minimum: 1, maximum: 100 },
            search: { type: 'string', maxLength: 100 },
            status: { type: 'string', enum: ['active', 'inactive', 'all'] }
          }
        },
        responseSchema: {
          type: 'object',
          properties: {
            users: {
              type: 'array',
              maxItems: 100,
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string', maxLength: 255 },
                  name: { type: 'string', maxLength: 100 },
                  status: { type: 'string', enum: ['active', 'inactive'] }
                }
              }
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                page: { type: 'integer' },
                pages: { type: 'integer' }
              }
            }
          }
        }
      }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: FiBook },
    { id: 'endpoints', label: 'Endpoints', icon: FiCode },
    { id: 'settings', label: 'Configurações', icon: FiSettings }
  ];

  const renderSchema = (schema, title) => {
    const renderProperty = (key, prop, level = 0) => {
      const indent = level * 20;
      return (
        <div key={key} className="mb-2" style={{ marginLeft: `${indent}px` }}>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm text-blue-600">{key}</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{prop.type}</span>
            {prop.maxLength && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                max: {prop.maxLength}
              </span>
            )}
            {prop.maxItems && (
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                max items: {prop.maxItems}
              </span>
            )}
            {prop.enum && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                enum: {prop.enum.join(', ')}
              </span>
            )}
          </div>
          {prop.properties && (
            <div className="mt-2">
              {Object.entries(prop.properties).map(([subKey, subProp]) => 
                renderProperty(subKey, subProp, level + 1)
              )}
            </div>
          )}
          {prop.items && prop.items.properties && (
            <div className="mt-2">
              {Object.entries(prop.items.properties).map(([subKey, subProp]) => 
                renderProperty(subKey, subProp, level + 1)
              )}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">{title}</h4>
        {schema.properties && Object.entries(schema.properties).map(([key, prop]) => 
          renderProperty(key, prop)
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/catalog"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="w-5 h-5 text-gray-600" />
        </Link>
        <motion.h1 
          className="text-3xl font-bold text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {api.name}
        </motion.h1>
      </div>

      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações Básicas</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Provedor:</span>
                      <p className="text-gray-900">{api.provider}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Versão:</span>
                      <p className="text-gray-900">{api.version}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Status:</span>
                      <span className="inline-block ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {api.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Base URL:</span>
                      <p className="text-gray-900 font-mono text-sm">{api.baseUrl}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Links Úteis</h3>
                  <div className="space-y-2">
                    <a
                      href={api.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                    >
                      <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                      <span>Documentação</span>
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
                <p className="text-gray-600">{api.description}</p>
              </div>
            </div>
          )}

          {activeTab === 'endpoints' && (
            <div className="space-y-6">
              {api.endpoints.map((endpoint, index) => (
                <motion.div
                  key={endpoint.id}
                  className="border border-gray-200 rounded-lg p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-2 py-1 rounded font-mono text-xs font-medium ${
                      endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                      endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      endpoint.method === 'PUT' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="font-mono text-sm text-gray-900">{endpoint.path}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{endpoint.description}</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {renderSchema(endpoint.requestSchema, 'Esquema de Requisição')}
                    {renderSchema(endpoint.responseSchema, 'Esquema de Resposta')}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Configurações da API</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Rate Limiting</h4>
                      <p className="text-sm text-gray-600">1000 requisições por minuto</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Editar
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Autenticação</h4>
                      <p className="text-sm text-gray-600">Bearer Token (JWT)</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Editar
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Versioning</h4>
                      <p className="text-sm text-gray-600">URL Path (/v2/)</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ApiDetails;