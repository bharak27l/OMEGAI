import React from 'react';
import './Sidebar.css';

function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'chat', icon: '💬', label: 'Chat' },
    { id: 'files', icon: '📁', label: 'Files' },
    { id: 'terminal', icon: '⌨️', label: 'Terminal' },
    { id: 'memory', icon: '🧠', label: 'Memory' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Ω</h2>
      </div>
      
      <nav className="sidebar-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="status-indicator">
          <span className="status-dot online"></span>
          <span>Online</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
