import './HelpPage.css';

function HelpPage({ onClose }) {
  return (
    <div className="help-page">
      <div className="help-header">
        <div className="help-title">
          <img src="/logo.png" alt="Omega AI" className="help-logo pulse" />
          <h1>Omega AI Desktop - Help</h1>
        </div>
      </div>

      <div className="help-content">
        <section className="help-section">
          <h2>🚀 Getting Started</h2>
          <div className="help-card">
            <h3>Welcome to Omega AI!</h3>
            <p>Omega AI Desktop is a powerful multi-model AI coding assistant that automatically selects the best AI model for your tasks.</p>
            
            <ol className="steps-list">
              <li><strong>Set up API keys:</strong> Go to Settings (⚙️) and add your free API keys from OpenRouter, Groq, Together AI, and Moonshot AI.</li>
              <li><strong>Start chatting:</strong> Click on Chat (💬) in the sidebar and ask any coding question.</li>
              <li><strong>Auto-routing:</strong> The AI will automatically select the best model for your task (coding, debugging, architecture, etc.).</li>
              <li><strong>Manual selection:</strong> Or manually choose a specific model from the dropdown.</li>
            </ol>
          </div>
        </section>

        <section className="help-section">
          <h2>🤖 Available AI Models</h2>
          <div className="models-table">
            <div className="model-row">
              <span className="model-name">🎯 Qwen3 Coder</span>
              <span className="model-use">Best for: Complex coding, code generation, refactoring</span>
              <span className="model-provider">OpenRouter</span>
            </div>
            <div className="model-row">
              <span className="model-name">🔍 DeepSeek V3</span>
              <span className="model-use">Best for: Debugging, code analysis, optimization</span>
              <span className="model-provider">Together AI</span>
            </div>
            <div className="model-row">
              <span className="model-name">🏗️ Kimi K2</span>
              <span className="model-use">Best for: System architecture, design patterns</span>
              <span className="model-provider">Moonshot AI</span>
            </div>
            <div className="model-row">
              <span className="model-name">🦙 Llama 4</span>
              <span className="model-use">Best for: General questions, explanations</span>
              <span className="model-provider">Groq</span>
            </div>
            <div className="model-row">
              <span className="model-name">💎 Gemma 3</span>
              <span className="model-use">Best for: Quick responses, simple tasks</span>
              <span className="model-provider">Groq</span>
            </div>
            <div className="model-row">
              <span className="model-name">🌪️ Mistral Small</span>
              <span className="model-use">Best for: Concise answers, efficient responses</span>
              <span className="model-provider">Groq</span>
            </div>
          </div>
        </section>

        <section className="help-section">
          <h2>📁 Features Overview</h2>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">💬</span>
              <div>
                <strong>AI Chat</strong>
                <p>Chat with multiple AI models. Auto-selects the best model based on your task type.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📁</span>
              <div>
                <strong>File Explorer</strong>
                <p>Browse, read, edit, create, and delete files in your workspace.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⌨️</span>
              <div>
                <strong>Terminal</strong>
                <p>Execute shell commands directly from the application.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🧠</span>
              <div>
                <strong>Memory & History</strong>
                <p>View and search your conversation history. All conversations are stored locally.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚙️</span>
              <div>
                <strong>Settings</strong>
                <p>Configure API keys and view information about available models.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="help-section">
          <h2>⌨️ Keyboard Shortcuts</h2>
          <div className="shortcuts-grid">
            <div className="shortcut-item">
              <kbd>F1</kbd>
              <span>Open this Help page</span>
            </div>
            <div className="shortcut-item">
              <kbd>Esc</kbd>
              <span>Close Help / Modals</span>
            </div>
            <div className="shortcut-item">
              <kbd>Enter</kbd>
              <span>Send message in chat</span>
            </div>
            <div className="shortcut-item">
              <kbd>Shift + Enter</kbd>
              <span>New line in chat input</span>
            </div>
          </div>
        </section>

        <section className="help-section">
          <h2>❓ Troubleshooting</h2>
          <div className="help-card">
            <h3>Common Issues</h3>
            <details>
              <summary>API Key errors</summary>
              <p>Make sure you've entered valid API keys in Settings. Each provider has a link to get your free key.</p>
            </details>
            <details>
              <summary>Model not responding</summary>
              <p>Check your internet connection. Some models may have rate limits on free tiers.</p>
            </details>
            <details>
              <summary>Backend connection failed</summary>
              <p>Ensure the backend server is running on port 3000. Run <code>npm start</code> in the backend directory.</p>
            </details>
          </div>
        </section>

        <section className="help-section">
          <h2>📞 Support</h2>
          <p>For more help, visit our documentation or report issues on GitHub.</p>
          <div className="support-links">
            <a href="#" className="btn-support">Documentation</a>
            <a href="#" className="btn-support">GitHub Issues</a>
          </div>
        </section>
      </div>

      <button className="btn-close-help" onClick={onClose}>Close Help (Esc)</button>
    </div>
  );
}

export default HelpPage;
