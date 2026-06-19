const express = require('express');
const router = express.Router();
const aiService = require('../services/ai');

// Get available models
router.get('/models', async (req, res) => {
  try {
    const models = await aiService.getAvailableModels();
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat with auto-routing
router.post('/chat', async (req, res) => {
  try {
    const { message, context, selectedModel } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await aiService.processRequest(message, context, selectedModel);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Multi-model comparison
router.post('/compare', async (req, res) => {
  try {
    const { message, context, models } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const responses = await aiService.compareModels(message, context, models);
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
