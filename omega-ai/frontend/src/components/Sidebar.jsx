import { useState } from 'react';
import './Sidebar.css';

const menuItems = [
  { id: 'chat', icon: '💬', label: 'Chat' },
  { id: 'files', icon: '📁', label: 'Files' },
  { id: 'terminal', icon: '⌨️', label: 'Terminal' },
  { id: 'memory', icon: '🧠', label: 'Memory' },
  { id: 'settings', icon: '⚙️', label: 'Settings' }
];

function Sidebar({ currentPage, setCurrentPage, onOpenHelp }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src="/logo.png" alt="Omega AI" className="sidebar-logo pulse" />
          <span className="logo-text">OMEGA AI</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {currentPage === item.id && <div className="nav-indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item help-btn" onClick={onOpenHelp}>
          <span className="nav-icon">❓</span>
          <span className="nav-label">Help</span>
        </button>
        
        <div className="version-info">
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
