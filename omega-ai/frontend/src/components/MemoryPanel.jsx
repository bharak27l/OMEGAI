import { useState, useEffect } from 'react';
import axios from 'axios';
import './MemoryPanel.css';

const API_URL = 'http://localhost:3000/api';

function MemoryPanel() {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const res = await axios.get(`${API_URL}/memory/conversations`);
      setConversations(res.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (convId) => {
    try {
      const res = await axios.get(`${API_URL}/memory/conversations/${convId}`);
      setMessages(res.data);
      setSelectedConv(convId);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const deleteConversation = async (convId, e) => {
    e.stopPropagation();
    if (!confirm('Delete this conversation?')) return;
    
    try {
      await axios.delete(`${API_URL}/memory/conversations/${convId}`);
      loadConversations();
      if (selectedConv === convId) {
        setSelectedConv(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <div className="memory-panel">
      <div className="memory-header">
        <h2>🧠 Memory & History</h2>
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="memory-content">
        <div className="conversation-list">
          {conversations.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">💭</span>
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations
              .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((conv) => (
                <div
                  key={conv.id}
                  className={`conversation-item ${selectedConv === conv.id ? 'active' : ''}`}
                  onClick={() => loadMessages(conv.id)}
                >
                  <div className="conv-info">
                    <span className="conv-title">{conv.title}</span>
                    <span className="conv-date">{new Date(conv.updated_at).toLocaleDateString()}</span>
                  </div>
                  <button 
                    className="btn-delete-conv"
                    onClick={(e) => deleteConversation(conv.id, e)}
                  >
                    🗑
                  </button>
                </div>
              ))
          )}
        </div>

        {selectedConv && (
          <div className="conversation-view">
            <div className="view-header">
              <h3>{conversations.find(c => c.id === selectedConv)?.title}</h3>
              <span className="msg-count">{messages.length} messages</span>
            </div>
            <div className="view-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`msg-preview ${msg.role}`}>
                  <span className="msg-role">{msg.role === 'user' ? '👤 You' : `🤖 ${msg.model || 'AI'}`}</span>
                  <p className="msg-content">{msg.content.substring(0, 200)}{msg.content.length > 200 ? '...' : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemoryPanel;
