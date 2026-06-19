import React from 'react';
import './FileExplorer.css';

function FileExplorer({ files, setFiles }) {
  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <h3>📁 Project Files</h3>
        <button className="refresh-btn">Refresh</button>
      </div>
      <div className="file-list">
        <div className="empty-state">
          <span className="empty-icon">📂</span>
          <p>No project loaded</p>
          <button className="open-project-btn">Open Project</button>
        </div>
      </div>
    </div>
  );
}

export default FileExplorer;
