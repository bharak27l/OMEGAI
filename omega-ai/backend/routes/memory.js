const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../database/omega-memory.db');

// Initialize database
let db;
try {
  db = new Database(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id INTEGER,
      role TEXT,
      content TEXT,
      model TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    )
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      embedding TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
} catch (error) {
  console.error('Database initialization failed:', error.message);
}

// Get all conversations
router.get('/conversations', (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    
    const conversations = db.prepare('SELECT * FROM conversations ORDER BY updated_at DESC').all();
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new conversation
router.post('/conversations', (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    
    const { title } = req.body;
    const result = db.prepare('INSERT INTO conversations (title) VALUES (?)').run(title || 'New Conversation');
    
    res.json({ id: result.lastInsertRowid, title: title || 'New Conversation' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get conversation messages
router.get('/conversations/:id', (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    
    const messages = db.prepare(`
      SELECT * FROM messages 
      WHERE conversation_id = ? 
      ORDER BY created_at ASC
    `).all(req.params.id);
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add message to conversation
router.post('/messages', (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    
    const { conversation_id, role, content, model } = req.body;
    
    if (!conversation_id || !role || !content) {
      return res.status(400).json({ error: 'Conversation ID, role, and content are required' });
    }

    const result = db.prepare(`
      INSERT INTO messages (conversation_id, role, content, model) 
      VALUES (?, ?, ?, ?)
    `).run(conversation_id, role, content, model || 'auto');

    // Update conversation timestamp
    db.prepare('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(conversation_id);
    
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete conversation
router.delete('/conversations/:id', (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    
    db.prepare('DELETE FROM messages WHERE conversation_id = ?').run(req.params.id);
    db.prepare('DELETE FROM conversations WHERE id = ?').run(req.params.id);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search documents (RAG)
router.get('/search', (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Simple text search (in production, use vector embeddings)
    const results = db.prepare(`
      SELECT * FROM documents 
      WHERE content LIKE ? OR title LIKE ?
      LIMIT 10
    `).all(`%${query}%`, `%${query}%`);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add document to RAG store
router.post('/documents', (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });
    
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = db.prepare(`
      INSERT INTO documents (title, content) 
      VALUES (?, ?)
    `).run(title, content);
    
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
