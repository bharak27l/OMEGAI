import { useState, useEffect } from 'react';
import axios from 'axios';
import './FileExplorer.css';

const API_URL = 'http://localhost:3000/api';

function FileExplorer() {
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async (path = '') => {
    try {
      const res = await axios.get(`${API_URL}/files/list`, { params: { path } });
      setFiles(res.data);
      setCurrentPath(path);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  const navigateTo = (path) => {
    loadFiles(path);
    setSelectedFile(null);
  };

  const readFile = async (file) => {
    if (file.isDirectory) {
      navigateTo(file.path);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/files/read`, { params: { path: file.path } });
      setSelectedFile(file);
      setFileContent(res.data.content);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to read file:', error);
    }
  };

  const saveFile = async () => {
    try {
      await axios.post(`${API_URL}/files/write`, {
        path: selectedFile.path,
        content: fileContent
      });
      setIsEditing(false);
      alert('File saved successfully!');
    } catch (error) {
      console.error('Failed to save file:', error);
      alert('Failed to save file');
    }
  };

  const getFileIcon = (file) => {
    if (file.isDirectory) return '📁';
    const ext = file.name.split('.').pop().toLowerCase();
    const icons = {
      js: '📄', jsx: '⚛️', ts: '📘', tsx: '⚛️',
      py: '🐍', java: '☕', c: '©️', cpp: '⚙️',
      html: '🌐', css: '🎨', json: '📋', md: '📝',
      sh: '⌨️', yml: '⚙️', yaml: '⚙️'
    };
    return icons[ext] || '📄';
  };

  return (
    <div className="file-explorer">
      <div className="explorer-header">
        <h2>📁 File Explorer</h2>
        <div className="breadcrumb">
          {currentPath.split('/').filter(Boolean).map((part, idx, arr) => (
            <span key={idx}>
              <button onClick={() => navigateTo(arr.slice(0, idx + 1).join('/'))}>
                {part}
              </button>
              {idx < arr.length - 1 && <span>/</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="explorer-content">
        <div className="file-list">
          {files.map((file) => (
            <div
              key={file.path}
              className={`file-item ${selectedFile?.path === file.path ? 'selected' : ''}`}
              onClick={() => readFile(file)}
            >
              <span className="file-icon">{getFileIcon(file)}</span>
              <span className="file-name">{file.name}</span>
              {file.isDirectory && <span className="folder-arrow">›</span>}
            </div>
          ))}
        </div>

        {selectedFile && (
          <div className="file-editor">
            <div className="editor-header">
              <span className="editor-title">{getFileIcon(selectedFile)} {selectedFile.name}</span>
              <div className="editor-actions">
                {!isEditing ? (
                  <button className="btn-edit" onClick={() => setIsEditing(true)}>✏️ Edit</button>
                ) : (
                  <>
                    <button className="btn-save" onClick={saveFile}>💾 Save</button>
                    <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                  </>
                )}
              </div>
            </div>
            {isEditing ? (
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="editor-textarea"
              />
            ) : (
              <pre className="file-preview">{fileContent}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FileExplorer;
