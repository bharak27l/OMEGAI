import { useState } from 'react';
import './ModelSelector.css';

function ModelSelector({ selectedModel, setSelectedModel, models }) {
  const [isOpen, setIsOpen] = useState(false);

  const getModelIcon = (modelId) => {
    const icons = {
      'qwen3-coder': '🎯',
      'deepseek-v3': '🔍',
      'kimi-k2': '🏗️',
      'llama-4': '🦙',
      'gemma-3': '💎',
      'mistral-small': '🌪️'
    };
    return icons[modelId] || '🤖';
  };

  return (
    <div className="model-selector">
      <button 
        className="model-select-btn" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="model-icon">{selectedModel === 'auto' ? '🔄' : getModelIcon(selectedModel)}</span>
        <span className="model-name">
          {selectedModel === 'auto' 
            ? 'Auto Select' 
            : models.find(m => m.id === selectedModel)?.name || selectedModel}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="model-dropdown">
          <div className="dropdown-header">Select AI Model</div>
          
          <button
            className={`model-option ${selectedModel === 'auto' ? 'active' : ''}`}
            onClick={() => { setSelectedModel('auto'); setIsOpen(false); }}
          >
            <span className="option-icon">🔄</span>
            <div className="option-info">
              <span className="option-name">Auto Select (Recommended)</span>
              <span className="option-desc">AI chooses best model for task</span>
            </div>
          </button>

          <div className="dropdown-divider"></div>

          {models.map((model) => (
            <button
              key={model.id}
              className={`model-option ${selectedModel === model.id ? 'active' : ''}`}
              onClick={() => { setSelectedModel(model.id); setIsOpen(false); }}
            >
              <span className="option-icon">{getModelIcon(model.id)}</span>
              <div className="option-info">
                <span className="option-name">{model.name}</span>
                <span className="option-desc">{model.description}</span>
                <div className="option-stats">
                  <span className="stat accuracy" title="Accuracy">
                    {'⭐'.repeat(model.accuracy)}
                  </span>
                  <span className="stat speed" title="Speed">
                    {'⚡'.repeat(model.speed)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ModelSelector;
