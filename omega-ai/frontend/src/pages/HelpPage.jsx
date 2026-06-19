import React, { useState } from 'react';
import './HelpPage.css';

function HelpPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: '🚀 Getting Started', icon: '🚀' },
    { id: 'models', title: '🤖 AI Models', icon: '🤖' },
    { id: 'features', title: '✨ Features', icon: '✨' },
    { id: 'shortcuts', title: '⌨️ Shortcuts', icon: '⌨️' },
    { id: 'api-keys', title: '🔑 API Keys', icon: '🔑' },
    { id: 'troubleshooting', title: '🔧 Troubleshooting', icon: '🔧' },
  ];

  return (
    <div className="help-page">
      <div className="help-sidebar">
        <h2>Help & Documentation</h2>
        <nav>
          {sections.map((section) => (
            <button
              key={section.id}
              className={`help-nav-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="help-nav-icon">{section.icon}</span>
              <span>{section.title}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="help-content">
        {activeSection === 'getting-started' && (
          <div className="help-section">
            <h1>🚀 Getting Started with Omega AI Desktop</h1>
            
            <div className="help-card">
              <h3>Welcome to Omega AI!</h3>
              <p>Omega AI Desktop is a powerful multi-model AI coding assistant designed for Ubuntu desktop. It combines the best free AI models to help you code faster and smarter.</p>
            </div>

            <div className="help-card">
              <h3>Quick Start</h3>
              <ol>
                <li><strong>Start the App:</strong> Click the <code>./start.sh</code> script or double-click the Omega AI icon</li>
                <li><strong>Configure API Keys:</strong> Go to Settings and add your free API keys</li>
                <li><strong>Start Coding:</strong> Ask questions in the Chat panel</li>
                <li><strong>Explore Features:</strong> Try Files, Terminal, and Memory tabs</li>
              </ol>
            </div>

            <div className="help-card">
              <h3>How It Works</h3>
              <p>Omega AI uses smart routing to automatically select the best AI model for your task:</p>
              <ul>
                <li>💻 <strong>Coding tasks</strong> → Qwen3-Coder</li>
                <li>🐛 <strong>Debugging</strong> → DeepSeek-V3</li>
                <li>🏗️ <strong>Architecture</strong> → Kimi K2</li>
                <li>📝 <strong>General questions</strong> → Llama 4</li>
                <li>⚡ <strong>Quick responses</strong> → Gemma 3 or Mistral Small</li>
              </ul>
            </div>

            <div className="logo-showcase">
              <img src="/assets/logo.svg" alt="Omega AI Logo" className="animated-logo" />
              <p className="logo-caption">Omega AI - Your Multi-Model Coding Assistant</p>
            </div>
          </div>
        )}

        {activeSection === 'models' && (
          <div className="help-section">
            <h1>🤖 AI Models</h1>
            
            <div className="models-grid">
              <div className="model-card premium">
                <h3>Qwen3-Coder</h3>
                <div className="model-rating">⭐⭐⭐⭐⭐</div>
                <div className="model-speed">Speed: ⭐⭐⭐⭐</div>
                <p><strong>Best for:</strong> Writing code, code review, refactoring</p>
                <p><strong>Provider:</strong> OpenRouter</p>
                <p>Top-tier coding model with excellent understanding of multiple programming languages.</p>
              </div>

              <div className="model-card premium">
                <h3>DeepSeek-V3</h3>
                <div className="model-rating">⭐⭐⭐⭐⭐</div>
                <div className="model-speed">Speed: ⭐⭐⭐⭐</div>
                <p><strong>Best for:</strong> Debugging, error analysis, testing</p>
                <p><strong>Provider:</strong> Together AI</p>
                <p>Exceptional at finding and fixing bugs in your code.</p>
              </div>

              <div className="model-card premium">
                <h3>Kimi K2</h3>
                <div className="model-rating">⭐⭐⭐⭐⭐</div>
                <div className="model-speed">Speed: ⭐⭐⭐</div>
                <p><strong>Best for:</strong> Architecture design, system planning</p>
                <p><strong>Provider:</strong> Moonshot AI</p>
                <p>Perfect for high-level design decisions and architectural patterns.</p>
              </div>

              <div className="model-card">
                <h3>Llama 4</h3>
                <div className="model-rating">⭐⭐⭐⭐</div>
                <div className="model-speed">Speed: ⭐⭐⭐⭐</div>
                <p><strong>Best for:</strong> General questions, explanations</p>
                <p><strong>Provider:</strong> Groq</p>
                <p>Versatile model great for understanding concepts and documentation.</p>
              </div>

              <div className="model-card fast">
                <h3>Gemma 3</h3>
                <div className="model-rating">⭐⭐⭐⭐</div>
                <div className="model-speed">Speed: ⭐⭐⭐⭐⭐</div>
                <p><strong>Best for:</strong> Quick responses, simple tasks</p>
                <p><strong>Provider:</strong> Groq</p>
                <p>Lightning-fast responses for straightforward questions.</p>
              </div>

              <div className="model-card fast">
                <h3>Mistral Small</h3>
                <div className="model-rating">⭐⭐⭐⭐</div>
                <div className="model-speed">Speed: ⭐⭐⭐⭐⭐</div>
                <p><strong>Best for:</strong> Summarization, brief answers</p>
                <p><strong>Provider:</strong> Groq</p>
                <p>Efficient model for quick summaries and concise responses.</p>
              </div>
            </div>

            <div className="help-card">
              <h3>Auto-Select Best Model</h3>
              <p>Enable "Auto-Select Best Model" to let Omega AI automatically choose the optimal model based on your task type. The AI Router analyzes your query and routes it to the most suitable model.</p>
            </div>
          </div>
        )}

        {activeSection === 'features' && (
          <div className="help-section">
            <h1>✨ Features</h1>

            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">💬</span>
                <div>
                  <h3>Multi-Model Chat</h3>
                  <p>Chat with multiple AI models simultaneously. Get the best response plus alternative answers from other models.</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">📁</span>
                <div>
                  <h3>File Explorer</h3>
                  <p>Browse, read, edit, and create files directly within the app. AI can help modify your code files.</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">⌨️</span>
                <div>
                  <h3>Integrated Terminal</h3>
                  <p>Execute commands securely within the app. Perfect for running tests, building projects, and more.</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">🧠</span>
                <div>
                  <h3>Memory System</h3>
                  <p>Your conversations are saved locally. The AI remembers context across sessions for better assistance.</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">🔄</span>
                <div>
                  <h3>Smart Routing</h3>
                  <p>Automatic task detection routes your queries to the best-suited AI model for optimal results.</p>
                </div>
              </div>

              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <div>
                  <h3>Alternative Responses</h3>
                  <p>See multiple AI perspectives on the same problem. Compare solutions from different models.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'shortcuts' && (
          <div className="help-section">
            <h1>⌨️ Keyboard Shortcuts</h1>

            <div className="shortcuts-table">
              <div className="shortcut-row">
                <kbd>Ctrl + N</kbd>
                <span>New Chat</span>
              </div>
              <div className="shortcut-row">
                <kbd>Ctrl + Enter</kbd>
                <span>Send Message</span>
              </div>
              <div className="shortcut-row">
                <kbd>Ctrl + K</kbd>
                <span>Focus Search</span>
              </div>
              <div className="shortcut-row">
                <kbd>Esc</kbd>
                <span>Close Panel</span>
              </div>
              <div className="shortcut-row">
                <kbd>Ctrl + ,</kbd>
                <span>Open Settings</span>
              </div>
              <div className="shortcut-row">
                <kbd>F1</kbd>
                <span>Open Help</span>
              </div>
              <div className="shortcut-row">
                <kbd>Ctrl + Shift + T</kbd>
                <span>Toggle Terminal</span>
              </div>
              <div className="shortcut-row">
                <kbd>Ctrl + Shift + F</kbd>
                <span>Toggle Files</span>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'api-keys' && (
          <div className="help-section">
            <h1>🔑 API Keys Setup</h1>

            <div className="help-card">
              <h3>Getting Free API Keys</h3>
              <p>Omega AI uses free tiers of various AI providers. Here's how to get your keys:</p>
              
              <ol>
                <li>
                  <strong>OpenRouter</strong> (for Qwen3-Coder)
                  <ul>
                    <li>Visit: <a href="https://openrouter.ai" target="_blank" rel="noopener">openrouter.ai</a></li>
                    <li>Sign up for free account</li>
                    <li>Get your API key from dashboard</li>
                  </ul>
                </li>
                <li>
                  <strong>Groq</strong> (for Llama 4, Gemma 3, Mistral)
                  <ul>
                    <li>Visit: <a href="https://groq.com" target="_blank" rel="noopener">groq.com</a></li>
                    <li>Create free account</li>
                    <li>Generate API key in console</li>
                  </ul>
                </li>
                <li>
                  <strong>Together AI</strong> (for DeepSeek-V3)
                  <ul>
                    <li>Visit: <a href="https://together.xyz" target="_blank" rel="noopener">together.xyz</a></li>
                    <li>Sign up for free tier</li>
                    <li>Copy your API key</li>
                  </ul>
                </li>
                <li>
                  <strong>Moonshot AI</strong> (for Kimi K2)
                  <ul>
                    <li>Visit: <a href="https://moonshot.ai" target="_blank" rel="noopener">moonshot.ai</a></li>
                    <li>Register for access</li>
                    <li>Obtain API credentials</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div className="help-card warning">
              <h3>⚠️ Important Notes</h3>
              <ul>
                <li>Keep your API keys secure and never share them</li>
                <li>Free tiers have usage limits</li>
                <li>Keys are stored locally in the .env file</li>
                <li>You can use as many or as few models as you want</li>
              </ul>
            </div>
          </div>
        )}

        {activeSection === 'troubleshooting' && (
          <div className="help-section">
            <h1>🔧 Troubleshooting</h1>

            <div className="troubleshoot-item">
              <h3>App won't start</h3>
              <p><strong>Solution:</strong> Run <code>./stop.sh</code> first to clean up processes, then try <code>./start.sh</code> again.</p>
            </div>

            <div className="troubleshoot-item">
              <h3>"API key not configured" error</h3>
              <p><strong>Solution:</strong> Go to Settings and add your API keys, or edit the .env file manually.</p>
            </div>

            <div className="troubleshoot-item">
              <h3>Models not responding</h3>
              <p><strong>Solution:</strong> Check your internet connection and verify API keys are valid. Some models may have rate limits.</p>
            </div>

            <div className="troubleshoot-item">
              <h3>Terminal commands not working</h3>
              <p><strong>Solution:</strong> Ensure you have proper permissions. Some commands may require sudo privileges.</p>
            </div>

            <div className="troubleshoot-item">
              <h3>High memory usage</h3>
              <p><strong>Solution:</strong> Close unused tabs and reduce the number of simultaneous models queried.</p>
            </div>

            <div className="troubleshoot-item">
              <h3>Need more help?</h3>
              <p>Check the logs in the <code>logs/</code> directory or ask Omega AI itself for help!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HelpPage;
