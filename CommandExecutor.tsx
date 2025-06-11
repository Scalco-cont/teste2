import React, { useState } from 'react';
import { 
  Terminal, 
  Power, 
  RotateCcw, 
  Lock, 
  Play, 
  Square,
  CheckSquare,
  Settings,
  Trash2,
  Clock,
  Activity,
  HardDrive,
  Users,
  Wifi
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

interface CommandExecutorProps {
  computers: Computer[];
}

interface CommandResult {
  id: string;
  computerName: string;
  command: string;
  output: string;
  status: 'running' | 'success' | 'error';
  timestamp: string;
}

const CommandExecutor: React.FC<CommandExecutorProps> = ({ computers }) => {
  const [selectedComputers, setSelectedComputers] = useState<string[]>([]);
  const [customCommand, setCustomCommand] = useState('');
  const [results, setResults] = useState<CommandResult[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const predefinedCommands = [
    {
      name: 'Informações do Sistema',
      icon: Activity,
      command: 'Get-ComputerInfo | Select-Object WindowsProductName, TotalPhysicalMemory, CsProcessors',
      category: 'info',
      color: 'bg-blue-600'
    },
    {
      name: 'Desligar PC',
      icon: Power,
      command: 'Stop-Computer -Force',
      category: 'power',
      color: 'bg-red-600'
    },
    {
      name: 'Reiniciar PC',
      icon: RotateCcw,
      command: 'Restart-Computer -Force',
      category: 'power',
      color: 'bg-orange-600'
    },
    {
      name: 'Bloquear Tela',
      icon: Lock,
      command: 'rundll32.exe user32.dll,LockWorkStation',
      category: 'power',
      color: 'bg-purple-600'
    },
    {
      name: 'Listar Processos',
      icon: Settings,
      command: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 Name, CPU, WorkingSet',
      category: 'info',
      color: 'bg-green-600'
    },
    {
      name: 'Uso do Disco',
      icon: HardDrive,
      command: 'Get-PSDrive -PSProvider FileSystem | Select-Object Name, @{Name="Usado(GB)";Expression={[math]::Round($_.Used/1GB,2)}}, @{Name="Livre(GB)";Expression={[math]::Round($_.Free/1GB,2)}}',
      category: 'info',
      color: 'bg-indigo-600'
    },
    {
      name: 'Informações de Rede',
      icon: Wifi,
      command: 'Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -ne "127.0.0.1"} | Select-Object IPAddress, InterfaceAlias',
      category: 'info',
      color: 'bg-teal-600'
    },
    {
      name: 'Usuário Atual',
      icon: Users,
      command: 'whoami; Get-Date',
      category: 'info',
      color: 'bg-cyan-600'
    }
  ];

  const handleComputerSelection = (computerId: string) => {
    setSelectedComputers(prev => 
      prev.includes(computerId) 
        ? prev.filter(id => id !== computerId)
        : [...prev, computerId]
    );
  };

  const selectAll = () => {
    const onlineComputers = computers.filter(c => c.status === 'online').map(c => c.id);
    setSelectedComputers(onlineComputers);
  };

  const deselectAll = () => {
    setSelectedComputers([]);
  };

  const executeCommand = async (command: string) => {
    if (selectedComputers.length === 0) {
      alert('Selecione pelo menos um computador');
      return;
    }

    setIsExecuting(true);

    // Add initial running results
    const runningResults: CommandResult[] = selectedComputers.map(computerId => {
      const computer = computers.find(c => c.id === computerId)!;
      return {
        id: Date.now().toString() + computerId,
        computerName: computer.name,
        command,
        output: 'Executando comando...',
        status: 'running' as const,
        timestamp: new Date().toLocaleString()
      };
    });

    setResults(prev => [...runningResults, ...prev]);

    // Simulate command execution
    for (const computerId of selectedComputers) {
      const computer = computers.find(c => c.id === computerId)!;
      
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% success rate
        const mockOutput = generateMockOutput(command, success);
        
        setResults(prev => prev.map(result => 
          result.computerName === computer.name && result.status === 'running'
            ? {
                ...result,
                output: mockOutput,
                status: success ? 'success' : 'error',
                timestamp: new Date().toLocaleString()
              }
            : result
        ));
      }, Math.random() * 3000 + 1000); // 1-4 seconds delay
    }

    setTimeout(() => {
      setIsExecuting(false);
    }, 4000);
  };

  const generateMockOutput = (command: string, success: boolean): string => {
    if (!success) {
      return 'Erro: Acesso negado ou falha na execução do comando';
    }

    if (command.includes('Get-ComputerInfo')) {
      return `WindowsProductName : Windows 11 Pro
TotalPhysicalMemory : 17179865088
CsProcessors        : {Intel(R) Core(TM) i7-12700K CPU @ 3.60GHz}`;
    }
    if (command.includes('Get-Process')) {
      return `Name                    CPU WorkingSet
----                    --- ----------
chrome               15.2   524288000
firefox               8.7   312345600
notepad               5.1   256789123
explorer              2.3   145678901`;
    }
    if (command.includes('Get-PSDrive')) {
      return `Name Usado(GB) Livre(GB)
---- --------- ---------
C         245       755
D         150       850`;
    }
    if (command.includes('Get-NetIPAddress')) {
      return `IPAddress        InterfaceAlias
---------        --------------
192.168.1.105    Ethernet
10.0.0.15        Wi-Fi`;
    }
    if (command.includes('whoami')) {
      return `DESKTOP-ABC123\\administrador
Segunda-feira, 27 de janeiro de 2025 14:45:30`;
    }
    if (command.includes('Stop-Computer') || command.includes('Restart-Computer')) {
      return 'Comando executado com sucesso. Sistema será desligado/reiniciado em breve.';
    }
    if (command.includes('LockWorkStation')) {
      return 'Tela bloqueada com sucesso.';
    }
    
    return 'Comando executado com sucesso.';
  };

  const clearResults = () => {
    setResults([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'success':
        return <CheckSquare className="w-4 h-4 text-green-400" />;
      case 'error':
        return <Square className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'border-l-yellow-500 bg-yellow-500/5';
      case 'success':
        return 'border-l-green-500 bg-green-500/5';
      case 'error':
        return 'border-l-red-500 bg-red-500/5';
      default:
        return 'border-l-slate-500';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left Panel - Computer Selection */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Selecionar Computadores</h2>
          <p className="text-slate-400">Escolha os computadores para executar comandos</p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={selectAll}
            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
          >
            Selecionar Todos Online
          </button>
          <button
            onClick={deselectAll}
            className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
          >
            Desmarcar Todos
          </button>
        </div>

        <div className="space-y-2">
          {computers.map((computer) => (
            <div
              key={computer.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                computer.status === 'offline' 
                  ? 'opacity-50 cursor-not-allowed border-slate-700' 
                  : selectedComputers.includes(computer.id)
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
              onClick={() => computer.status !== 'offline' && handleComputerSelection(computer.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  selectedComputers.includes(computer.id)
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-slate-600'
                }`}>
                  {selectedComputers.includes(computer.id) && (
                    <CheckSquare className="w-3 h-3 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white flex items-center space-x-2">
                    <span>{computer.name}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      computer.status === 'online' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                  </h3>
                  <p className="text-sm text-slate-400">{computer.host}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4">
          <h3 className="font-medium text-white mb-3">Comando Personalizado</h3>
          <textarea
            value={customCommand}
            onChange={(e) => setCustomCommand(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
            rows={4}
            placeholder="Digite um comando PowerShell..."
          />
          <button
            onClick={() => executeCommand(customCommand)}
            disabled={!customCommand.trim() || selectedComputers.length === 0 || isExecuting}
            className="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Executar Comando</span>
          </button>
        </div>
      </div>

      {/* Middle Panel - Predefined Commands */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Comandos Rápidos</h2>
          <p className="text-slate-400">Execute operações comuns do sistema</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {predefinedCommands.map((cmd, index) => {
            const Icon = cmd.icon;
            return (
              <button
                key={index}
                onClick={() => executeCommand(cmd.command)}
                disabled={selectedComputers.length === 0 || isExecuting}
                className={`p-4 rounded-lg ${cmd.color} hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all duration-200 flex items-center space-x-3 text-left`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">{cmd.name}</h3>
                  <p className="text-sm opacity-80 font-mono text-xs mt-1 truncate">
                    {cmd.command.substring(0, 40)}...
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Resultados</h2>
            <p className="text-slate-400">Saída da execução dos comandos</p>
          </div>
          <button
            onClick={clearResults}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar</span>
          </button>
        </div>

        <div className="space-y-3 max-h-[800px] overflow-y-auto">
          {results.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum comando executado ainda</p>
            </div>
          ) : (
            results.map((result) => (
              <div
                key={result.id}
                className={`p-4 rounded-lg border-l-4 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(result.status)}
                    <h3 className="font-medium text-white">{result.computerName}</h3>
                  </div>
                  <span className="text-xs text-slate-500">{result.timestamp}</span>
                </div>
                
                <p className="text-sm text-slate-400 mb-2 font-mono">
                  {result.command}
                </p>
                
                <div className="bg-slate-900 rounded-lg p-3">
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                    {result.output}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandExecutor;