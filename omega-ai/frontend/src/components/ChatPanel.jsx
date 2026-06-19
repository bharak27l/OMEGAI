import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ModelSelector from './ModelSelector';
import './ChatPanel.css';

const API_URL = 'http://localhost:3000/api';

function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('auto');
  const [models, setModels] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadModels();
    loadConversation();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadModels = async () => {
    try {
      const res = await axios.get(`${API_URL}/ai/models`);
      setModels(res.data);
    } catch (error) {
      console.error('Failed to load models:', error);
    }
  };

  const loadConversation = () => {
    const saved = localStorage.getItem('omega-conversation');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  };

  const saveConversation = (msgs) => {
    localStorage.setItem('omega-conversation', JSON.stringify(msgs));
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_URL}/ai/chat`, {
        message: input,
        selectedModel: selectedModel === 'auto' ? null : selectedModel
      });

      const aiMessage = {
        role: 'assistant',
        content: res.data.response,
        model: res.data.modelName,
        provider: res.data.provider,
        taskType: res.data.taskType,
        duration: res.data.duration,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      saveConversation([...messages, userMessage, aiMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error.message}. Please check your API keys in Settings.`,
        isError: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('omega-conversation');
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h2>💬 AI Chat</h2>
        <div className="header-actions">
          <ModelSelector 
            selectedModel={selectedModel} 
            setSelectedModel={setSelectedModel}
            models={models}
          />
          <button className="btn-clear" onClick={clearChat}>Clear</button>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <img src="/logo.png" alt="Omega AI" className="welcome-logo pulse" />
            <h1>Welcome to Omega AI Desktop</h1>
            <p>Your multi-model AI coding assistant</p>
            <div className="features-grid">
              <div className="feature-card">
                <span className="feature-icon">🎯</span>
                <h3>Smart Routing</h3>
                <p>Auto-selects best model for each task</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⚡</span>
                <h3>6+ Models</h3>
                <p>Qwen3, DeepSeek, Kimi, Llama, Gemma, Mistral</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">📁</span>
                <h3>File Editing</h3>
                <p>Read, write, and manage project files</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⌨️</span>
                <h3>Terminal</h3>
                <p>Execute commands directly</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role} ${msg.isError ? 'error' : ''}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? '👤' : msg.isError ? '⚠️' : '🤖'}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-role">
                      {msg.role === 'user' ? 'You' : msg.model || 'AI'}
                    </span>
                    {msg.model && (
                      <span className="model-badge">{msg.model}</span>
                    )}
                    {msg.taskType && (
                      <span className="task-badge">{msg.taskType}</span>
                    )}
                    {msg.duration && (
                      <span className="time-badge">{msg.duration}ms</span>
                    )}
                  </div>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant loading">
                <div className="message-avatar">🤖</div>
                <div className="message-content">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <p>Selecting optimal model for your task...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask anything... (Shift+Enter for new line)"
          disabled={isLoading}
          rows={3}
        />
        <button 
          className="btn-send" 
          onClick={sendMessage} 
          disabled={!input.trim() || isLoading}
        >
          Send 🚀
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
