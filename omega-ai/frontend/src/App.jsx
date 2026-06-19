import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatPanel from './components/ChatPanel';
import FileExplorer from './components/FileExplorer';
import TerminalPanel from './components/TerminalPanel';
import MemoryPanel from './components/MemoryPanel';
import SettingsPanel from './components/SettingsPanel';
import HelpPage from './pages/HelpPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('chat');
  const [showHelp, setShowHelp] = useState(false);

  // Handle F1 key for help
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setShowHelp(true);
      }
      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHelp]);

  const renderPage = () => {
    switch (currentPage) {
      case 'chat':
        return <ChatPanel />;
      case 'files':
        return <FileExplorer />;
      case 'terminal':
        return <TerminalPanel />;
      case 'memory':
        return <MemoryPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <ChatPanel />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        onOpenHelp={() => setShowHelp(true)}
      />
      
      <main className="main-content">
        {renderPage()}
      </main>

      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowHelp(false)}>×</button>
            <HelpPage onClose={() => setShowHelp(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
