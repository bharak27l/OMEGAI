import { useState, useEffect, useRef } from 'react';
import ChatPanel from './components/ChatPanel';
import Sidebar from './components/Sidebar';
import ModelSelector from './components/ModelSelector';
import FileExplorer from './components/FileExplorer';
import TerminalPanel from './components/TerminalPanel';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [selectedModels, setSelectedModels] = useState(['qwen3-coder', 'deepseek-v3']);
  const [autoSelect, setAutoSelect] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [files, setFiles] = useState([]);
  const [terminalOutput, setTerminalOutput] = useState([]);

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="main-content">
        <header className="app-header">
          <h1>🚀 Omega AI Desktop</h1>
          <ModelSelector 
            selectedModels={selectedModels}
            setSelectedModels={setSelectedModels}
            autoSelect={autoSelect}
            setAutoSelect={setAutoSelect}
          />
        </header>

        <div className="content-area">
          {activeTab === 'chat' && (
            <ChatPanel 
              messages={messages}
              setMessages={setMessages}
              selectedModels={selectedModels}
              autoSelect={autoSelect}
            />
          )}
          
          {activeTab === 'files' && (
            <FileExplorer files={files} setFiles={setFiles} />
          )}
          
          {activeTab === 'terminal' && (
            <TerminalPanel output={terminalOutput} setOutput={setTerminalOutput} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
