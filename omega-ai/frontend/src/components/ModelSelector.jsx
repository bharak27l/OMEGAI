import React, { useState } from 'react';
import './ModelSelector.css';

const AVAILABLE_MODELS = [
  { id: 'qwen3-coder', name: 'Qwen3 Coder', provider: 'OpenRouter', specialty: 'coding', speed: 4, accuracy: 5 },
  { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'Together AI', specialty: 'debugging', speed: 4, accuracy: 5 },
  { id: 'kimi-k2', name: 'Kimi K2', provider: 'Moonshot', specialty: 'architecture', speed: 3, accuracy: 5 },
  { id: 'llama4', name: 'Llama 4', provider: 'Groq', specialty: 'general', speed: 4, accuracy: 4 },
  { id: 'gemma3', name: 'Gemma 3', provider: 'Google', specialty: 'fast', speed: 5, accuracy: 4 },
  { id: 'mistral-small', name: 'Mistral Small', provider: 'Mistral', specialty: 'quick', speed: 5, accuracy: 4 },
  { id: 'codellama', name: 'CodeLlama', provider: 'HuggingFace', specialty: 'code-gen', speed: 3, accuracy: 4 },
  { id: 'starcoder2', name: 'StarCoder2', provider: 'HuggingFace', specialty: 'completion', speed: 4, accuracy: 4 },
];

function ModelSelector({ selectedModels, setSelectedModels, autoSelect, setAutoSelect }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleModel = (modelId) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter(m => m !== modelId));
    } else {
      setSelectedModels([...selectedModels, modelId]);
    }
  };

  const getModelInfo = (id) => AVAILABLE_MODELS.find(m => m.id === id);

  return (
    <div className="model-selector">
      <div className="auto-select-toggle">
        <label>
          <input
            type="checkbox"
            checked={autoSelect}
            onChange={(e) => setAutoSelect(e.target.checked)}
          />
          Auto-Select Best Model
        </label>
      </div>

      <div className="selected-models">
        {selectedModels.map((modelId) => {
          const model = getModelInfo(modelId);
          return (
            <span key={modelId} className="model-tag">
              {model?.name || modelId}
              <button onClick={() => toggleModel(modelId)}>×</button>
            </span>
          );
        })}
      </div>

      <div className="model-dropdown">
        <button 
          className="add-model-btn"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          + Add Model
        </button>
        
        {showDropdown && (
          <div className="dropdown-content">
            <h4>Available Models</h4>
            {AVAILABLE_MODELS.map((model) => (
              <div
                key={model.id}
                className={`model-option ${selectedModels.includes(model.id) ? 'selected' : ''}`}
                onClick={() => toggleModel(model.id)}
              >
                <div className="model-info">
                  <strong>{model.name}</strong>
                  <span className="provider">{model.provider}</span>
                </div>
                <div className="model-stats">
                  <span title="Speed">⚡ {model.speed}/5</span>
                  <span title="Accuracy">🎯 {model.accuracy}/5</span>
                  <span className="specialty">{model.specialty}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModelSelector;
