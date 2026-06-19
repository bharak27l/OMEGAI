import express from 'express';
import aiRouter from '../ai/router.js';

const router = express.Router();

// POST /api/chat - Send message to AI models
router.post('/', async (req, res) => {
  try {
    const { 
      message, 
      models = [], 
      selectedModel, 
      taskType, 
      autoSelect = true,
      conversationHistory = [] 
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation messages
    const messages = [
      {
        role: 'system',
        content: `You are Omega AI, an expert coding assistant. You help with coding, debugging, architecture design, and general programming questions. Provide clear, accurate, and well-formatted responses with proper code blocks when applicable.`
      },
      ...conversationHistory.map(m => ({
        role: m.role,
        content: m.content,
      })),
      {
        role: 'user',
        content: message,
      },
    ];

    // Determine which models to use
    let modelsToUse = models;
    let detectedTaskType = taskType;

    if (autoSelect) {
      // Auto-detect task type
      detectedTaskType = aiRouter.detectTaskType(message);
      
      // Select best model for the task
      const bestModel = aiRouter.selectBestModel(detectedTaskType, models);
      modelsToUse = [bestModel];
    }

    if (modelsToUse.length === 0) {
      modelsToUse = ['qwen3-coder'];
    }

    // Query models
    const result = await aiRouter.queryMultipleModels(
      modelsToUse, 
      messages, 
      detectedTaskType || 'general'
    );

    res.json({
      response: result.response,
      model: result.model,
      provider: result.provider,
      responseTime: result.responseTime,
      taskType: detectedTaskType,
      alternatives: result.alternatives,
      autoSelected: autoSelect,
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error.message || 'Failed to process request',
    });
  }
});

// GET /api/chat/models - Get available models
router.get('/models', (req, res) => {
  const models = aiRouter.getAvailableModels();
  res.json({ models });
});

export default router;
