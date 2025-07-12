import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowLeft, FiSave, FiPlus, FiTrash2, FiCode, FiUpload } = FiIcons;

const CreateApi = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    version: '',
    description: '',
    baseUrl: '',
    category: '',
    authentication: 'bearer',
    rateLimit: 1000,
    endpoints: []
  });

  const [currentEndpoint, setCurrentEndpoint] = useState({
    method: 'GET',
    path: '',
    description: '',
    requestSchema: {
      type: 'object',
      properties: {}
    },
    responseSchema: {
      type: 'object',
      properties: {}
    }
  });

  const [currentField, setCurrentField] = useState({
    name: '',
    type: 'string',
    required: false,
    maxLength: '',
    maxItems: '',
    enum: ''
  });

  const [schemaType, setSchemaType] = useState('request');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [showJsonInput, setShowJsonInput] = useState(false);

  const providers = [
    'TechCorp Solutions',
    'PayFlow Systems',
    'DataLabs Analytics',
    'NotifyMe Services'
  ];

  const categories = [
    'payment',
    'user',
    'analytics',
    'notification',
    'integration',
    'security'
  ];

  const fieldTypes = [
    'string',
    'integer',
    'number',
    'boolean',
    'array',
    'object'
  ];

  const parseJsonToSchema = (jsonString) => {
    try {
      const jsonObj = JSON.parse(jsonString);
      return convertToSchema(jsonObj);
    } catch (error) {
      throw new Error('JSON inválido: ' + error.message);
    }
  };

  const convertToSchema = (obj, level = 0) => {
    const properties = {};

    const getType = (value) => {
      if (value === null) return 'string';
      if (typeof value === 'string') return 'string';
      if (typeof value === 'number') {
        return Number.isInteger(value) ? 'integer' : 'number';
      }
      if (typeof value === 'boolean') return 'boolean';
      if (Array.isArray(value)) return 'array';
      if (typeof value === 'object') return 'object';
      return 'string';
    };

    const analyzeStringValue = (value) => {
      const config = { type: 'string' };
      
      // Detectar email
      if (typeof value === 'string' && value.includes('@') && value.includes('.')) {
        config.format = 'email';
        config.maxLength = 255;
      }
      // Detectar URL
      else if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
        config.format = 'uri';
        config.maxLength = 500;
      }
      // Detectar data ISO
      else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        config.format = 'date-time';
      }
      // String normal
      else if (typeof value === 'string') {
        config.maxLength = Math.max(100, value.length * 2);
      }

      return config;
    };

    const analyzeArrayValue = (arr) => {
      const config = { type: 'array', maxItems: Math.max(10, arr.length * 2) };
      
      if (arr.length > 0) {
        const firstItem = arr[0];
        const itemType = getType(firstItem);
        
        if (itemType === 'object') {
          config.items = {
            type: 'object',
            properties: convertToSchema(firstItem, level + 1)
          };
        } else {
          config.items = { type: itemType };
          if (itemType === 'string') {
            Object.assign(config.items, analyzeStringValue(firstItem));
          }
        }
      } else {
        config.items = { type: 'string' };
      }
      
      return config;
    };

    Object.entries(obj).forEach(([key, value]) => {
      const type = getType(value);
      
      switch (type) {
        case 'string':
          properties[key] = analyzeStringValue(value);
          break;
        case 'integer':
        case 'number':
          properties[key] = { type };
          break;
        case 'boolean':
          properties[key] = { type };
          break;
        case 'array':
          properties[key] = analyzeArrayValue(value);
          break;
        case 'object':
          properties[key] = {
            type: 'object',
            properties: convertToSchema(value, level + 1)
          };
          break;
        default:
          properties[key] = { type: 'string' };
      }
    });

    return properties;
  };

  const handleJsonImport = () => {
    if (!jsonInput.trim()) {
      setJsonError('Por favor, insira um JSON válido');
      return;
    }

    try {
      const schema = parseJsonToSchema(jsonInput);
      const targetSchema = schemaType === 'request' ? 'requestSchema' : 'responseSchema';
      
      setCurrentEndpoint({
        ...currentEndpoint,
        [targetSchema]: {
          type: 'object',
          properties: schema
        }
      });

      setJsonInput('');
      setJsonError('');
      setShowJsonInput(false);
    } catch (error) {
      setJsonError(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEndpointChange = (e) => {
    setCurrentEndpoint({
      ...currentEndpoint,
      [e.target.name]: e.target.value
    });
  };

  const handleFieldChange = (e) => {
    setCurrentField({
      ...currentField,
      [e.target.name]: e.target.value
    });
  };

  const addField = () => {
    if (!currentField.name) return;

    const schema = schemaType === 'request' ? currentEndpoint.requestSchema : currentEndpoint.responseSchema;
    const fieldConfig = {
      type: currentField.type,
      ...(currentField.maxLength && { maxLength: parseInt(currentField.maxLength) }),
      ...(currentField.maxItems && { maxItems: parseInt(currentField.maxItems) }),
      ...(currentField.enum && { enum: currentField.enum.split(',').map(s => s.trim()) })
    };

    schema.properties[currentField.name] = fieldConfig;

    setCurrentEndpoint({
      ...currentEndpoint,
      [schemaType === 'request' ? 'requestSchema' : 'responseSchema']: schema
    });

    setCurrentField({
      name: '',
      type: 'string',
      required: false,
      maxLength: '',
      maxItems: '',
      enum: ''
    });
  };

  const removeField = (fieldName) => {
    const schema = schemaType === 'request' ? currentEndpoint.requestSchema : currentEndpoint.responseSchema;
    delete schema.properties[fieldName];
    
    setCurrentEndpoint({
      ...currentEndpoint,
      [schemaType === 'request' ? 'requestSchema' : 'responseSchema']: schema
    });
  };

  const addEndpoint = () => {
    if (!currentEndpoint.path) return;

    setFormData({
      ...formData,
      endpoints: [...formData.endpoints, { ...currentEndpoint, id: Date.now() }]
    });

    setCurrentEndpoint({
      method: 'GET',
      path: '',
      description: '',
      requestSchema: {
        type: 'object',
        properties: {}
      },
      responseSchema: {
        type: 'object',
        properties: {}
      }
    });
  };

  const removeEndpoint = (endpointId) => {
    setFormData({
      ...formData,
      endpoints: formData.endpoints.filter(ep => ep.id !== endpointId)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('API criada:', formData);
    navigate('/catalog');
  };

  const tabs = [
    { id: 'basic', label: 'Informações Básicas' },
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'review', label: 'Revisão' }
  ];

  const getFieldDisplayName = (fieldName, fieldConfig) => {
    let displayParts = [fieldName];
    
    if (fieldConfig.format) {
      displayParts.push(`(${fieldConfig.format})`);
    }
    
    return displayParts.join(' ');
  };

  const renderFieldConfig = (fieldConfig) => {
    const badges = [];
    
    badges.push(
      <span key="type" className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
        {fieldConfig.type}
      </span>
    );

    if (fieldConfig.format) {
      badges.push(
        <span key="format" className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
          {fieldConfig.format}
        </span>
      );
    }

    if (fieldConfig.maxLength) {
      badges.push(
        <span key="maxLength" className="text-xs bg-gray-100 px-2 py-1 rounded">
          max: {fieldConfig.maxLength}
        </span>
      );
    }

    if (fieldConfig.maxItems) {
      badges.push(
        <span key="maxItems" className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
          max items: {fieldConfig.maxItems}
        </span>
      );
    }

    if (fieldConfig.enum) {
      badges.push(
        <span key="enum" className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
          enum: {fieldConfig.enum.join(', ')}
        </span>
      );
    }

    return badges;
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
          Nova API
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
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da API *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: User Management API"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provedor *
                  </label>
                  <select
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione um provedor</option>
                    {providers.map(provider => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Versão *
                  </label>
                  <input
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: v1.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base URL *
                  </label>
                  <input
                    type="url"
                    name="baseUrl"
                    value={formData.baseUrl}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://api.exemplo.com/v1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva a funcionalidade da API..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autenticação
                  </label>
                  <select
                    name="authentication"
                    value={formData.authentication}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="bearer">Bearer Token</option>
                    <option value="api-key">API Key</option>
                    <option value="oauth">OAuth 2.0</option>
                    <option value="basic">Basic Auth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate Limit (req/min)
                  </label>
                  <input
                    type="number"
                    name="rateLimit"
                    value={formData.rateLimit}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'endpoints' && (
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Endpoint</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Método
                    </label>
                    <select
                      name="method"
                      value={currentEndpoint.method}
                      onChange={handleEndpointChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                      <option value="PATCH">PATCH</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Path
                    </label>
                    <input
                      type="text"
                      name="path"
                      value={currentEndpoint.path}
                      onChange={handleEndpointChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="/users"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={currentEndpoint.description}
                      onChange={handleEndpointChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Listar usuários"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => setSchemaType('request')}
                        className={`px-4 py-2 rounded-lg ${
                          schemaType === 'request' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Esquema de Requisição
                      </button>
                      <button
                        type="button"
                        onClick={() => setSchemaType('response')}
                        className={`px-4 py-2 rounded-lg ${
                          schemaType === 'response' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Esquema de Resposta
                      </button>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setShowJsonInput(!showJsonInput)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <SafeIcon icon={FiCode} className="w-4 h-4" />
                      <span>Importar JSON</span>
                    </button>
                  </div>

                  {showJsonInput && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cole um exemplo JSON para gerar automaticamente os campos:
                        </label>
                        <textarea
                          value={jsonInput}
                          onChange={(e) => setJsonInput(e.target.value)}
                          placeholder={`Exemplo para ${schemaType === 'request' ? 'requisição' : 'resposta'}:
${schemaType === 'request' ? 
`{
  "name": "João Silva",
  "email": "joao@email.com",
  "age": 30,
  "active": true,
  "roles": ["user", "admin"],
  "profile": {
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Desenvolvedor"
  }
}` : 
`{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "João Silva",
  "email": "joao@email.com",
  "createdAt": "2024-03-15T10:30:00Z",
  "status": "active"
}`}`}
                          rows={8}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        />
                      </div>
                      
                      {jsonError && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-600 text-sm">{jsonError}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={handleJsonImport}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <SafeIcon icon={FiUpload} className="w-4 h-4" />
                          <span>Importar Campos</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowJsonInput(false);
                            setJsonInput('');
                            setJsonError('');
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Campo
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={currentField.name}
                        onChange={handleFieldChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo
                      </label>
                      <select
                        name="type"
                        value={currentField.type}
                        onChange={handleFieldChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {fieldTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamanho Máximo
                      </label>
                      <input
                        type="number"
                        name="maxLength"
                        value={currentField.maxLength}
                        onChange={handleFieldChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="255"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Items (Array)
                      </label>
                      <input
                        type="number"
                        name="maxItems"
                        value={currentField.maxItems}
                        onChange={handleFieldChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enum (separado por vírgula)
                      </label>
                      <input
                        type="text"
                        name="enum"
                        value={currentField.enum}
                        onChange={handleFieldChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="active,inactive"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addField}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    <span>Adicionar Campo</span>
                  </button>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Campos do {schemaType === 'request' ? 'Requisição' : 'Resposta'}:
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(
                        schemaType === 'request' 
                          ? currentEndpoint.requestSchema.properties 
                          : currentEndpoint.responseSchema.properties
                      ).map(([fieldName, fieldConfig]) => (
                        <div key={fieldName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3 flex-wrap gap-2">
                            <span className="font-mono text-sm font-medium">{getFieldDisplayName(fieldName, fieldConfig)}</span>
                            {renderFieldConfig(fieldConfig)}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeField(fieldName)}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addEndpoint}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4" />
                  <span>Adicionar Endpoint</span>
                </button>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Endpoints Adicionados ({formData.endpoints.length})
                </h3>
                <div className="space-y-3">
                  {formData.endpoints.map((endpoint, index) => (
                    <div key={endpoint.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          endpoint.method === 'PUT' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {endpoint.method}
                        </span>
                        <span className="font-mono text-sm">{endpoint.path}</span>
                        <span className="text-gray-600 text-sm">{endpoint.description}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEndpoint(endpoint.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revisão da API</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Nome:</span>
                      <p className="text-gray-900">{formData.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Provedor:</span>
                      <p className="text-gray-900">{formData.provider}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Versão:</span>
                      <p className="text-gray-900">{formData.version}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Categoria:</span>
                      <p className="text-gray-900">{formData.category}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-500">Descrição:</span>
                    <p className="text-gray-900">{formData.description}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Endpoints ({formData.endpoints.length}):</span>
                    <div className="mt-2 space-y-2">
                      {formData.endpoints.map((endpoint, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {endpoint.method}
                          </span>
                          <span className="font-mono text-sm">{endpoint.path}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex items-center justify-end space-x-4">
                  <Link
                    to="/catalog"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4" />
                    <span>Salvar API</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateApi;