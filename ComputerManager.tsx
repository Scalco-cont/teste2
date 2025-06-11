import React, { useState } from 'react';
import { 
  Monitor, 
  Plus, 
  Edit3, 
  Trash2, 
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';

interface Computer {
  id: string;
  name: string;
  host: string;
  username: string;
  password: string;
  description: string;
  status: 'online' | 'offline' | 'unknown';
  lastSeen?: string;
}

interface ComputerManagerProps {
  computers: Computer[];
  setComputers: React.Dispatch<React.SetStateAction<Computer[]>>;
}

const ComputerManager: React.FC<ComputerManagerProps> = ({ computers, setComputers }) => {
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    username: '',
    password: '',
    description: ''
  });

  const handleSelect = (computer: Computer) => {
    setSelectedComputer(computer);
    setFormData({
      name: computer.name,
      host: computer.host,
      username: computer.username,
      password: computer.password,
      description: computer.description
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    if (selectedComputer) {
      // Update existing
      setComputers(prev => prev.map(c => 
        c.id === selectedComputer.id 
          ? { ...c, ...formData }
          : c
      ));
    } else {
      // Add new
      const newComputer: Computer = {
        id: Date.now().toString(),
        ...formData,
        status: 'unknown'
      };
      setComputers(prev => [...prev, newComputer]);
    }
    handleClear();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este computador?')) {
      setComputers(prev => prev.filter(c => c.id !== id));
      if (selectedComputer?.id === id) {
        handleClear();
      }
    }
  };

  const handleClear = () => {
    setSelectedComputer(null);
    setIsEditing(false);
    setFormData({
      name: '',
      host: '',
      username: '',
      password: '',
      description: ''
    });
  };

  const testConnection = async (computer: Computer) => {
    // Simulate connection test
    setComputers(prev => prev.map(c => 
      c.id === computer.id 
        ? { ...c, status: 'unknown' }
        : c
    ));
    
    setTimeout(() => {
      const isOnline = Math.random() > 0.3; // 70% success rate
      setComputers(prev => prev.map(c => 
        c.id === computer.id 
          ? { 
              ...c, 
              status: isOnline ? 'online' : 'offline',
              lastSeen: new Date().toLocaleString()
            }
          : c
      ));
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4 text-green-400" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'border-l-green-500 bg-green-500/5';
      case 'offline':
        return 'border-l-red-500 bg-red-500/5';
      default:
        return 'border-l-yellow-500 bg-yellow-500/5';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Computer List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Computadores</h2>
            <p className="text-slate-400">Gerencie seus computadores remotos</p>
          </div>
          <button
            onClick={() => {
              handleClear();
              setIsEditing(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar PC</span>
          </button>
        </div>

        <div className="space-y-3">
          {computers.map((computer) => (
            <div
              key={computer.id}
              onClick={() => handleSelect(computer)}
              className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all duration-200 hover:bg-slate-800/50 ${
                getStatusColor(computer.status)
              } ${selectedComputer?.id === computer.id ? 'ring-2 ring-blue-500/50' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(computer.status)}
                    <Monitor className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{computer.name}</h3>
                    <p className="text-sm text-slate-400">{computer.host}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      testConnection(computer);
                    }}
                    className="p-1.5 rounded-md hover:bg-slate-700 transition-colors"
                    title="Testar Conexão"
                  >
                    <CheckCircle className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(computer.id);
                    }}
                    className="p-1.5 rounded-md hover:bg-red-900/50 transition-colors"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              
              {computer.description && (
                <p className="mt-2 text-sm text-slate-500">{computer.description}</p>
              )}
              
              {computer.lastSeen && (
                <p className="mt-1 text-xs text-slate-600">Última conexão: {computer.lastSeen}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Computer Details Form */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {selectedComputer ? 'Detalhes do PC' : 'Adicionar Novo PC'}
            </h2>
            <p className="text-slate-400">
              {selectedComputer ? 'Visualizar e editar informações do computador' : 'Digite os dados de conexão do computador'}
            </p>
          </div>
          {selectedComputer && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Editar</span>
            </button>
          )}
        </div>

        <div className="bg-slate-900/50 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nome do Computador
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={!isEditing && selectedComputer}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="Ex: PC-Escritório, PC-Recepção"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              IP ou Nome do Computador
            </label>
            <input
              type="text"
              value={formData.host}
              onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
              disabled={!isEditing && selectedComputer}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="192.168.1.100 ou DESKTOP-ABC123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nome de Usuário
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              disabled={!isEditing && selectedComputer}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="administrador, usuario, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                disabled={!isEditing && selectedComputer}
                className="w-full px-3 py-2 pr-10 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="Digite a senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Descrição (Opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={!isEditing && selectedComputer}
              rows={3}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
              placeholder="Ex: Computador da recepção, PC do gerente"
            />
          </div>

          {(isEditing || !selectedComputer) && (
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleSave}
                disabled={!formData.name || !formData.host || !formData.username}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {selectedComputer ? 'Atualizar Computador' : 'Adicionar Computador'}
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Limpar
              </button>
            </div>
          )}

          {selectedComputer && !isEditing && (
            <div className="pt-4">
              <button
                onClick={() => testConnection(selectedComputer)}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Testar Conexão</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComputerManager;