import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import './ChatPanel.css';

function ChatPanel({ messages, setMessages, selectedModels, autoSelect }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectTaskType = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('bug') || lower.includes('error') || lower.includes('fix')) return 'debugging';
    if (lower.includes('architecture') || lower.includes('design') || lower.includes('structure')) return 'architecture';
    if (lower.includes('write') || lower.includes('create') || lower.includes('implement')) return 'coding';
    if (lower.includes('explain') || lower.includes('what') || lower.includes('how')) return 'explanation';
    return 'general';
  };

  const selectBestModel = (taskType) => {
    const modelPriority = {
      coding: ['qwen3-coder', 'deepseek-v3', 'starcoder2'],
      debugging: ['deepseek-v3', 'qwen3-coder', 'codellama'],
      architecture: ['kimi-k2', 'llama4', 'qwen3-coder'],
      explanation: ['llama4', 'gemma3', 'mistral-small'],
      general: ['llama4', 'gemma3', 'mistral-small'],
    };

    const priority = modelPriority[taskType] || modelPriority.general;
    return selectedModels.find(m => priority.includes(m)) || selectedModels[0] || 'qwen3-coder';
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const taskType = autoSelect ? detectTaskType(input) : 'general';
      const modelToUse = autoSelect ? selectBestModel(taskType) : selectedModels[0];

      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          models: selectedModels,
          selectedModel: modelToUse,
          taskType,
          autoSelect,
          conversationHistory: messages.slice(-10),
        }),
      });

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response || data.error || 'No response received',
        model: data.model || modelToUse,
        taskType,
        timestamp: new Date().toISOString(),
        alternatives: data.alternatives || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `Error: ${error.message}. Make sure the backend server is running.`,
        isError: true,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  return (
    <div className="chat-panel">
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h2>🚀 Welcome to Omega AI Desktop</h2>
            <p>Your multi-model AI coding assistant</p>
            <div className="feature-cards">
              <div className="feature-card">
                <span className="feature-icon">🎯</span>
                <h3>Smart Routing</h3>
                <p>Auto-selects the best model for your task</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⚡</span>
                <h3>Multiple Models</h3>
                <p>Access to 8+ free AI models simultaneously</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">📁</span>
                <h3>File Editing</h3>
                <p>Edit code directly in your project</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🧠</span>
                <h3>Memory System</h3>
                <p>Remembers context across conversations</p>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role} ${message.isError ? 'error' : ''}`}
          >
            <div className="message-header">
              <span className="message-role">
                {message.role === 'user' ? '👤 You' : `🤖 ${message.model || 'AI'}`}
              </span>
              <span className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div
              className="message-content"
              dangerouslySetInnerHTML={{ __html: marked(message.content) }}
            />
            {message.alternatives && message.alternatives.length > 0 && (
              <div className="alternatives">
                <h4>Alternative Responses:</h4>
                {message.alternatives.map((alt, idx) => (
                  <div key={idx} className="alternative-response">
                    <strong>{alt.model}:</strong>
                    <div dangerouslySetInnerHTML={{ __html: marked alt.content }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="message assistant loading">
            <div className="message-header">
              <span className="message-role">🤖 AI is thinking...</span>
            </div>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            adjustTextareaHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about coding, debugging, or architecture..."
          rows={1}
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading || !input.trim()}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
