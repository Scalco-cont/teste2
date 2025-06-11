import React, { useState } from 'react';
import { 
  Upload, 
  Download, 
  File, 
  Folder,
  CheckSquare,
  Square,
  ArrowRight,
  Trash2,
  RefreshCw,
  FolderOpen,
  FileText,
  Archive
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

interface FileManagerProps {
  computers: Computer[];
}

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  size: string;
  modified: string;
}

interface TransferTask {
  id: string;
  type: 'upload' | 'download';
  fileName: string;
  computerName: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
}

const FileManager: React.FC<FileManagerProps> = ({ computers }) => {
  const [selectedComputers, setSelectedComputers] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('C:\\');
  const [localFile, setLocalFile] = useState('');
  const [remotePath, setRemotePath] = useState('C:\\Temp\\');
  const [transfers, setTransfers] = useState<TransferTask[]>([]);
  const [remoteFiles, setRemoteFiles] = useState<FileItem[]>([
    { name: 'Documentos', type: 'directory', size: '-', modified: '2025-01-27 10:30' },
    { name: 'Downloads', type: 'directory', size: '-', modified: '2025-01-27 12:15' },
    { name: 'sistema.log', type: 'file', size: '2.5 MB', modified: '2025-01-27 14:20' },
    { name: 'config.json', type: 'file', size: '1.2 KB', modified: '2025-01-27 13:45' },
    { name: 'backup.zip', type: 'file', size: '156.8 MB', modified: '2025-01-26 16:30' }
  ]);

  const handleComputerSelection = (computerId: string) => {
    setSelectedComputers(prev => 
      prev.includes(computerId) 
        ? prev.filter(id => id !== computerId)
        : [...prev, computerId]
    );
  };

  const selectAllOnline = () => {
    setSelectedComputers(computers.filter(c => c.status === 'online').map(c => c.id));
  };

  const handleUpload = () => {
    if (!localFile || selectedComputers.length === 0) {
      alert('Selecione um arquivo e computadores de destino');
      return;
    }

    const newTransfers: TransferTask[] = selectedComputers.map(computerId => {
      const computer = computers.find(c => c.id === computerId)!;
      return {
        id: Date.now().toString() + computerId,
        type: 'upload',
        fileName: localFile.split('\\').pop() || localFile,
        computerName: computer.name,
        status: 'running',
        progress: 0
      };
    });

    setTransfers(prev => [...newTransfers, ...prev]);

    // Simulate upload progress
    newTransfers.forEach(transfer => {
      simulateProgress(transfer.id, 'upload');
    });
  };

  const simulateProgress = (transferId: string, type: 'upload' | 'download') => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5; // 5-20% increments
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setTransfers(prev => prev.map(t => 
          t.id === transferId 
            ? { ...t, progress: 100, status: Math.random() > 0.1 ? 'completed' : 'error' }
            : t
        ));
      } else {
        setTransfers(prev => prev.map(t => 
          t.id === transferId 
            ? { ...t, progress: Math.round(progress) }
            : t
        ));
      }
    }, 500);
  };

  const refreshFileList = () => {
    // Simulate file list refresh
    const mockFiles: FileItem[] = [
      { name: 'Arquivos de Programas', type: 'directory', size: '-', modified: '2025-01-27 09:00' },
      { name: 'Windows', type: 'directory', size: '-', modified: '2025-01-27 08:30' },
      { name: 'Usuários', type: 'directory', size: '-', modified: '2025-01-27 11:45' },
      { name: 'arquivo-temp.txt', type: 'file', size: '524 B', modified: '2025-01-27 14:35' },
      { name: 'instalador.msi', type: 'file', size: '45.2 MB', modified: '2025-01-27 13:20' }
    ];
    setRemoteFiles(mockFiles);
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'directory') {
      return <Folder className="w-4 h-4 text-blue-400" />;
    }
    
    const ext = item.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'txt':
      case 'log':
        return <FileText className="w-4 h-4 text-slate-400" />;
      case 'zip':
      case 'rar':
        return <Archive className="w-4 h-4 text-orange-400" />;
      default:
        return <File className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTransferStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'border-l-blue-500 bg-blue-500/5';
      case 'completed':
        return 'border-l-green-500 bg-green-500/5';
      case 'error':
        return 'border-l-red-500 bg-red-500/5';
      default:
        return 'border-l-slate-500 bg-slate-500/5';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Left Panel - Computer Selection & File Operations */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Operações de Arquivo</h2>
          <p className="text-slate-400">Transferir arquivos entre computadores</p>
        </div>

        {/* Computer Selection */}
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-white">Selecionar Computadores</h3>
            <button
              onClick={selectAllOnline}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Selecionar Todos Online
            </button>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {computers.map((computer) => (
              <div
                key={computer.id}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  computer.status === 'offline' 
                    ? 'opacity-50 cursor-not-allowed' 
                    : selectedComputers.includes(computer.id)
                    ? 'bg-blue-500/20'
                    : 'hover:bg-slate-800'
                }`}
                onClick={() => computer.status !== 'offline' && handleComputerSelection(computer.id)}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded border ${
                    selectedComputers.includes(computer.id)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-slate-600'
                  }`}>
                    {selectedComputers.includes(computer.id) && (
                      <CheckSquare className="w-3 h-3 text-white -m-0.5" />
                    )}
                  </div>
                  <span className="text-sm text-white">{computer.name}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    computer.status === 'online' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-slate-900/50 rounded-lg p-4">
          <h3 className="font-medium text-white mb-3 flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Enviar Arquivo</span>
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Caminho do Arquivo Local</label>
              <input
                type="text"
                value={localFile}
                onChange={(e) => setLocalFile(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm"
                placeholder="C:\Users\Admin\arquivo.txt"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-1">Destino Remoto</label>
              <input
                type="text"
                value={remotePath}
                onChange={(e) => setRemotePath(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm"
                placeholder="C:\Temp\"
              />
            </div>
            
            <button
              onClick={handleUpload}
              disabled={!localFile || selectedComputers.length === 0}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded transition-colors flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Enviar para Selecionados</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900/50 rounded-lg p-4">
          <h3 className="font-medium text-white mb-3">Ações Rápidas</h3>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors">
              Implantar Pacote
            </button>
            <button className="w-full px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors">
              Sincronizar Pastas
            </button>
            <button className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors">
              Backup de Arquivos
            </button>
          </div>
        </div>
      </div>

      {/* Middle Panel - Remote File Browser */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Arquivos Remotos</h2>
            <p className="text-slate-400">Navegar no sistema de arquivos remoto</p>
          </div>
          <button
            onClick={refreshFileList}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Path Navigation */}
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-sm">
            <FolderOpen className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={currentPath}
              onChange={(e) => setCurrentPath(e.target.value)}
              className="flex-1 bg-transparent text-white border-none outline-none"
            />
            <button className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs">
              Ir
            </button>
          </div>
        </div>

        {/* File List */}
        <div className="bg-slate-900/50 rounded-lg">
          <div className="p-4 border-b border-slate-800">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-400">
              <div className="col-span-6">Nome</div>
              <div className="col-span-3">Tamanho</div>
              <div className="col-span-3">Modificado</div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {remoteFiles.map((item, index) => (
              <div
                key={index}
                className="p-3 hover:bg-slate-800/50 cursor-pointer border-b border-slate-800/50 last:border-b-0"
              >
                <div className="grid grid-cols-12 gap-4 items-center text-sm">
                  <div className="col-span-6 flex items-center space-x-2">
                    {getFileIcon(item)}
                    <span className="text-white">{item.name}</span>
                  </div>
                  <div className="col-span-3 text-slate-400">{item.size}</div>
                  <div className="col-span-3 text-slate-400">{item.modified}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Transfer Queue */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Fila de Transferência</h2>
            <p className="text-slate-400">Operações de arquivo ativas</p>
          </div>
          <button
            onClick={() => setTransfers([])}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {transfers.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma transferência ativa</p>
            </div>
          ) : (
            transfers.map((transfer) => (
              <div
                key={transfer.id}
                className={`p-4 rounded-lg border-l-4 ${getTransferStatusColor(transfer.status)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-white flex items-center space-x-2">
                      {transfer.type === 'upload' ? (
                        <Upload className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Download className="w-4 h-4 text-green-400" />
                      )}
                      <span>{transfer.fileName}</span>
                    </h3>
                    <p className="text-sm text-slate-400">{transfer.computerName}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    transfer.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    transfer.status === 'error' ? 'bg-red-500/20 text-red-400' :
                    transfer.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {transfer.status === 'completed' ? 'Concluído' :
                     transfer.status === 'error' ? 'Erro' :
                     transfer.status === 'running' ? 'Executando' : 'Pendente'}
                  </span>
                </div>
                
                {transfer.status === 'running' && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Progresso</span>
                      <span className="text-white">{transfer.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${transfer.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FileManager;