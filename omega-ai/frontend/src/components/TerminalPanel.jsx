import React, { useState } from 'react';
import './TerminalPanel.css';

function TerminalPanel({ output, setOutput }) {
  const [command, setCommand] = useState('');

  const handleCommand = (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    const newOutput = [
      ...output,
      { type: 'input', content: `$ ${command}` },
      { type: 'output', content: 'Terminal execution requires backend integration. This is a placeholder.' },
    ];
    
    setOutput(newOutput);
    setCommand('');
  };

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <h3>⌨️ Terminal</h3>
        <div className="terminal-controls">
          <button>Clear</button>
          <button>Export</button>
        </div>
      </div>
      
      <div className="terminal-content">
        <div className="terminal-output">
          {output.length === 0 ? (
            <div className="terminal-welcome">
              <p>Terminal ready. Enter commands to execute.</p>
              <p className="hint">Commands will be executed in the project directory.</p>
            </div>
          ) : (
            output.map((line, idx) => (
              <div key={idx} className={`terminal-line ${line.type}`}>
                {line.content}
              </div>
            ))
          )}
        </div>
        
        <form onSubmit={handleCommand} className="terminal-input-form">
          <span className="prompt">$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter command..."
            className="terminal-input"
          />
        </form>
      </div>
    </div>
  );
}

export default TerminalPanel;
