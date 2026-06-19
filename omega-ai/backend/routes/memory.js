import express from 'express';

const router = express.Router();

// In-memory conversation memory (can be replaced with MongoDB/SQLite)
let conversations = new Map();
let globalMemory = [];

// POST /api/memory/save - Save conversation to memory
router.post('/save', (req, res) => {
  try {
    const { conversationId, messages, context } = req.body;

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }

    const existing = conversations.get(conversationId) || {
      id: conversationId,
      messages: [],
      contexts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (messages) {
      existing.messages.push(...messages);
    }

    if (context) {
      existing.contexts.push({
        ...context,
        timestamp: new Date().toISOString(),
      });
    }

    existing.updatedAt = new Date().toISOString();
    conversations.set(conversationId, existing);

    res.json({
      success: true,
      conversationId,
      messageCount: existing.messages.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/memory/get/:conversationId - Get conversation memory
router.get('/get/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = conversations.get(conversationId);

    if (!conversation) {
      return res.json({
        success: true,
        conversation: null,
        message: 'No conversation found',
      });
    }

    res.json({
      success: true,
      conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/memory/list - List all conversations
router.get('/list', (req, res) => {
  try {
    const allConversations = Array.from(conversations.values()).sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    res.json({
      success: true,
      count: allConversations.length,
      conversations: allConversations.map(c => ({
        id: c.id,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        messageCount: c.messages.length,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/memory/clear/:conversationId - Clear conversation memory
router.delete('/clear/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    conversations.delete(conversationId);

    res.json({
      success: true,
      message: 'Conversation cleared',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/memory/global - Add to global memory
router.post('/global', (req, res) => {
  try {
    const { content, type, tags } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    globalMemory.push({
      id: Date.now(),
      content,
      type: type || 'note',
      tags: tags || [],
      timestamp: new Date().toISOString(),
    });

    // Keep only last 100 items
    if (globalMemory.length > 100) {
      globalMemory = globalMemory.slice(-100);
    }

    res.json({
      success: true,
      id: globalMemory[globalMemory.length - 1].id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/memory/global - Get global memory
router.get('/global', (req, res) => {
  try {
    const { search } = req.query;

    let results = globalMemory;

    if (search) {
      const searchLower = search.toLowerCase();
      results = globalMemory.filter(
        item =>
          item.content.toLowerCase().includes(searchLower) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    res.json({
      success: true,
      count: results.length,
      memory: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
