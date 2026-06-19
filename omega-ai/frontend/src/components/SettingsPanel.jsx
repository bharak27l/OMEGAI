import { useState } from 'react';
import './SettingsPanel.css';

function SettingsPanel() {
  const [keys, setKeys] = useState({
    openrouter: localStorage.getItem('openrouter_key') || '',
    together: localStorage.getItem('together_key') || '',
    groq: localStorage.getItem('groq_key') || '',
    moonshot: localStorage.getItem('moonshot_key') || ''
  });

  const saveKey = (provider, value) => {
    localStorage.setItem(`${provider}_key`, value);
    setKeys(prev => ({ ...prev, [provider]: value }));
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
      </div>

      <div className="settings-content">
        <section className="settings-section">
          <h3>🔑 API Keys</h3>
          <p className="section-desc">Get free API keys from the providers below. Keys are stored locally in your browser.</p>
          
          <div className="api-key-group">
            <label>OpenRouter (for Qwen3-Coder)</label>
            <input
              type="password"
              placeholder="Enter OpenRouter API key"
              value={keys.openrouter}
              onChange={(e) => saveKey('openrouter', e.target.value)}
            />
            <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer">Get Key →</a>
          </div>

          <div className="api-key-group">
            <label>Together AI (for DeepSeek-V3)</label>
            <input
              type="password"
              placeholder="Enter Together AI API key"
              value={keys.together}
              onChange={(e) => saveKey('together', e.target.value)}
            />
            <a href="https://together.ai/" target="_blank" rel="noreferrer">Get Key →</a>
          </div>

          <div className="api-key-group">
            <label>Groq (for Llama 4, Gemma 3, Mistral Small)</label>
            <input
              type="password"
              placeholder="Enter Groq API key"
              value={keys.groq}
              onChange={(e) => saveKey('groq', e.target.value)}
            />
            <a href="https://groq.com/" target="_blank" rel="noreferrer">Get Key →</a>
          </div>

          <div className="api-key-group">
            <label>Moonshot AI (for Kimi K2)</label>
            <input
              type="password"
              placeholder="Enter Moonshot API key"
              value={keys.moonshot}
              onChange={(e) => saveKey('moonshot', e.target.value)}
            />
            <a href="https://platform.moonshot.cn/" target="_blank" rel="noreferrer">Get Key →</a>
          </div>
        </section>

        <section className="settings-section">
          <h3>📊 About Omega AI</h3>
          <div className="about-info">
            <img src="/logo.png" alt="Omega AI" className="about-logo pulse" />
            <div>
              <h4>Omega AI Desktop</h4>
              <p>Version 1.0.0</p>
              <p>A multi-model AI coding assistant that automatically selects the best AI model for your tasks.</p>
            </div>
          </div>
          
          <div className="models-grid">
            <div className="model-card">
              <span className="model-icon">🎯</span>
              <strong>Qwen3 Coder</strong>
              <span>Coding specialist</span>
            </div>
            <div className="model-card">
              <span className="model-icon">🔍</span>
              <strong>DeepSeek V3</strong>
              <span>Debugging expert</span>
            </div>
            <div className="model-card">
              <span className="model-icon">🏗️</span>
              <strong>Kimi K2</strong>
              <span>Architecture design</span>
            </div>
            <div className="model-card">
              <span className="model-icon">🦙</span>
              <strong>Llama 4</strong>
              <span>General purpose</span>
            </div>
            <div className="model-card">
              <span className="model-icon">💎</span>
              <strong>Gemma 3</strong>
              <span>Fast responses</span>
            </div>
            <div className="model-card">
              <span className="model-icon">🌪️</span>
              <strong>Mistral Small</strong>
              <span>Concise answers</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default SettingsPanel;
