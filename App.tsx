import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Plus, 
  Edit3, 
  Trash2, 
  Terminal, 
  Server,
  Power,
  RotateCcw,
  Lock,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Upload,
  Download,
  Play,
  Users,
  HardDrive,
  Activity
} from 'lucide-react';
import ComputerManager from './components/ComputerManager';
import CommandExecutor from './components/CommandExecutor';
import FileManager from './components/FileManager';
import SystemMonitor from './components/SystemMonitor';

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

function App() {
  const [activeTab, setActiveTab] = useState('computers');
  const [computers, setComputers] = useState<Computer[]>([
    {
      id: '1',
      name: 'PC-Escritório',
      host: '192.168.1.100',
      username: 'admin',
      password: '********',
      description: 'Computador principal do escritório',
      status: 'online',
      lastSeen: '2025-01-27 14:30:00'
    },
    {
      id: '2',
      name: 'PC-Recepção',
      host: '192.168.1.101',
      username: 'recepção',
      password: '********',
      description: 'Computador da recepção',
      status: 'offline',
      lastSeen: '2025-01-27 12:15:00'
    },
    {
      id: '3',
      name: 'PC-Gerência',
      host: '192.168.1.102',
      username: 'gerente',
      password: '********',
      description: 'Computador da gerência',
      status: 'online',
      lastSeen: '2025-01-27 14:35:00'
    }
  ]);

  const tabs = [
    { id: 'computers', label: 'Computadores', icon: Monitor },
    { id: 'commands', label: 'Comandos', icon: Terminal },
    { id: 'files', label: 'Arquivos', icon: HardDrive },
    { id: 'monitor', label: 'Monitor', icon: Activity }
  ];

  const onlineCount = computers.filter(c => c.status === 'online').length;
  const offlineCount = computers.filter(c => c.status === 'offline').length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Controle Remoto de PCs</h1>
                  <p className="text-sm text-slate-400">Gerenciador de Computadores Remotos</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-300">{onlineCount} Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-slate-300">{offlineCount} Offline</span>
                </div>
              </div>
              
              <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                <Settings className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-900/30 border-b border-slate-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'computers' && (
          <ComputerManager computers={computers} setComputers={setComputers} />
        )}
        {activeTab === 'commands' && (
          <CommandExecutor computers={computers} />
        )}
        {activeTab === 'files' && (
          <FileManager computers={computers} />
        )}
        {activeTab === 'monitor' && (
          <SystemMonitor computers={computers} />
        )}
      </main>
    </div>
  );
}

export default App;