import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  MemoryStick,
  Wifi,
  WifiOff,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Server,
  Thermometer,
  Zap
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

interface SystemMonitorProps {
  computers: Computer[];
}

interface SystemMetrics {
  computerId: string;
  computerName: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: string;
  temperature: number;
  processes: number;
  alerts: Alert[];
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ computers }) => {
  const [metrics, setMetrics] = useState<SystemMetrics[]>([]);
  const [selectedComputer, setSelectedComputer] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    // Initialize metrics for online computers
    const onlineComputers = computers.filter(c => c.status === 'online');
    const initialMetrics: SystemMetrics[] = onlineComputers.map(computer => ({
      computerId: computer.id,
      computerName: computer.name,
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      network: Math.random() * 100,
      uptime: generateRandomUptime(),
      temperature: 35 + Math.random() * 30,
      processes: Math.floor(150 + Math.random() * 200),
      alerts: generateRandomAlerts()
    }));
    
    setMetrics(initialMetrics);
  }, [computers]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        cpu: Math.max(0, Math.min(100, metric.cpu + (Math.random() - 0.5) * 20)),
        memory: Math.max(0, Math.min(100, metric.memory + (Math.random() - 0.5) * 10)),
        network: Math.max(0, Math.min(100, Math.random() * 100)),
        temperature: Math.max(30, Math.min(80, metric.temperature + (Math.random() - 0.5) * 5))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const generateRandomUptime = (): string => {
    const days = Math.floor(Math.random() * 30);
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const generateRandomAlerts = (): Alert[] => {
    const alertMessages = [
      'Alto uso de CPU detectado',
      'Uso de memória acima de 80%',
      'Espaço em disco baixo',
      'Problema de conectividade resolvido',
      'Temperatura do sistema normal'
    ];
    
    const alertTypes: ('warning' | 'error' | 'info')[] = ['warning', 'error', 'info'];
    
    return Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => ({
      id: `alert-${i}`,
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      message: alertMessages[Math.floor(Math.random() * alertMessages.length)],
      timestamp: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString()
    }));
  };

  const getMetricColor = (value: number, type: 'cpu' | 'memory' | 'disk' | 'network' | 'temperature') => {
    if (type === 'temperature') {
      if (value > 70) return 'text-red-400';
      if (value > 60) return 'text-yellow-400';
      return 'text-green-400';
    }
    
    if (value > 80) return 'text-red-400';
    if (value > 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getMetricBarColor = (value: number) => {
    if (value > 80) return 'bg-red-500';
    if (value > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const selectedMetric = selectedComputer ? metrics.find(m => m.computerId === selectedComputer) : null;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-l-red-500 bg-red-500/5';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-500/5';
      default:
        return 'border-l-blue-500 bg-blue-500/5';
    }
  };

  return (
    <div className="space-y-8">
      {/* Control Panel */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Monitor do Sistema</h2>
          <p className="text-slate-400">Métricas em tempo real e alertas do sistema</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded bg-slate-700 border-slate-600"
            />
            <span className="text-slate-300">Atualização Automática</span>
          </label>
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Ao Vivo</span>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.computerId}
            onClick={() => setSelectedComputer(
              selectedComputer === metric.computerId ? null : metric.computerId
            )}
            className={`bg-slate-900/50 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:bg-slate-800/50 ${
              selectedComputer === metric.computerId ? 'ring-2 ring-blue-500/50' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-white">{metric.computerName}</h3>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-3">
              {/* CPU */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-400">CPU</span>
                </div>
                <span className={`text-sm font-medium ${getMetricColor(metric.cpu, 'cpu')}`}>
                  {metric.cpu.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${getMetricBarColor(metric.cpu)}`}
                  style={{ width: `${metric.cpu}%` }}
                ></div>
              </div>

              {/* Memory */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MemoryStick className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Memória</span>
                </div>
                <span className={`text-sm font-medium ${getMetricColor(metric.memory, 'memory')}`}>
                  {metric.memory.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${getMetricBarColor(metric.memory)}`}
                  style={{ width: `${metric.memory}%` }}
                ></div>
              </div>

              {/* Quick Stats */}
              <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-slate-400">Uptime</div>
                  <div className="text-white font-medium">{metric.uptime}</div>
                </div>
                <div className="text-center">
                  <div className="text-slate-400">Temp</div>
                  <div className={`font-medium ${getMetricColor(metric.temperature, 'temperature')}`}>
                    {metric.temperature.toFixed(0)}°C
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View */}
      {selectedMetric && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detailed Metrics */}
          <div className="bg-slate-900/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>{selectedMetric.computerName} - Métricas Detalhadas</span>
            </h3>

            <div className="space-y-6">
              {/* CPU Details */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-white">Uso da CPU</span>
                  </div>
                  <span className={`text-lg font-bold ${getMetricColor(selectedMetric.cpu, 'cpu')}`}>
                    {selectedMetric.cpu.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getMetricBarColor(selectedMetric.cpu)}`}
                    style={{ width: `${selectedMetric.cpu}%` }}
                  ></div>
                </div>
              </div>

              {/* Memory Details */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MemoryStick className="w-5 h-5 text-purple-400" />
                    <span className="font-medium text-white">Uso da Memória</span>
                  </div>
                  <span className={`text-lg font-bold ${getMetricColor(selectedMetric.memory, 'memory')}`}>
                    {selectedMetric.memory.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getMetricBarColor(selectedMetric.memory)}`}
                    style={{ width: `${selectedMetric.memory}%` }}
                  ></div>
                </div>
              </div>

              {/* Disk Usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="w-5 h-5 text-green-400" />
                    <span className="font-medium text-white">Uso do Disco</span>
                  </div>
                  <span className={`text-lg font-bold ${getMetricColor(selectedMetric.disk, 'disk')}`}>
                    {selectedMetric.disk.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getMetricBarColor(selectedMetric.disk)}`}
                    style={{ width: `${selectedMetric.disk}%` }}
                  ></div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Thermometer className="w-4 h-4 text-orange-400" />
                    <span className="text-slate-400">Temperatura</span>
                  </div>
                  <span className={`text-2xl font-bold ${getMetricColor(selectedMetric.temperature, 'temperature')}`}>
                    {selectedMetric.temperature.toFixed(0)}°C
                  </span>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-slate-400">Processos</span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {selectedMetric.processes}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-slate-900/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Alertas do Sistema</span>
            </h3>

            <div className="space-y-3">
              {selectedMetric.alerts.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum alerta ativo</p>
                </div>
              ) : (
                selectedMetric.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-white font-medium">{alert.message}</p>
                        <p className="text-sm text-slate-400 mt-1">{alert.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* System Info */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <h4 className="font-medium text-white mb-4">Informações do Sistema</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tempo Ativo</span>
                  <span className="text-white">{selectedMetric.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Processos Ativos</span>
                  <span className="text-white">{selectedMetric.processes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Atividade de Rede</span>
                  <span className="text-white">{selectedMetric.network.toFixed(1)} Mbps</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemMonitor;