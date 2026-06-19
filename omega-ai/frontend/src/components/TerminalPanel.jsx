import { useState, useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import './TerminalPanel.css';

function TerminalPanel() {
  const terminalRef = useRef(null);
  const [terminal, setTerminal] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (terminalRef.current && !terminal) {
      const term = new Terminal({
        theme: {
          background: '#1a1a2e',
          foreground: '#ffffff',
          cursor: '#e94560',
          selection: 'rgba(233, 69, 96, 0.3)'
        },
        fontFamily: "'Fira Code', 'Consolas', monospace",
        fontSize: 14,
        cursorBlink: true
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      term.writeln('\x1b[1;35m╔════════════════════════════════════════╗\x1b[0m');
      term.writeln('\x1b[1;35m║\x1b[0m   \x1b[1;36m🚀 Omega AI Terminal\x1b[0m                 \x1b[1;35m║\x1b[0m');
      term.writeln('\x1b[1;35m╚════════════════════════════════════════╝\x1b[0m');
      term.writeln('');
      term.writeln('\x1b[33mWelcome to Omega AI Terminal!\x1b[0m');
      term.writeln('\x1b[90mType commands and press Enter to execute.\x1b[0m');
      term.writeln('');

      term.onData((data) => {
        // In a real implementation, send to backend via WebSocket
        term.write(data);
        if (data === '\r') {
          setTimeout(() => {
            term.write('\r\n$ ');
          }, 10);
        }
      });

      setTerminal(term);
      setIsConnected(true);

      const handleResize = () => fitAddon.fit();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        term.dispose();
      };
    }
  }, [terminal]);

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <div className="terminal-title">
          <span className="terminal-icon">⌨️</span>
          <span>Terminal</span>
          <span className={`status-badge ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '● Connected' : '○ Disconnected'}
          </span>
        </div>
        <div className="terminal-actions">
          <button className="btn-terminal" title="New Terminal">+</button>
          <button className="btn-terminal" title="Clear" onClick={() => terminal?.clear()}>🗑</button>
        </div>
      </div>
      <div className="terminal-container" ref={terminalRef} />
    </div>
  );
}

export default TerminalPanel;
