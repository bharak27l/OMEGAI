import express from 'express';
import aiRouter from '../ai/router.js';

const router = express.Router();

// GET /api/models - Get all available models
router.get('/', (req, res) => {
  try {
    const models = aiRouter.getAvailableModels();
    
    // Add status information for each model
    const modelsWithStatus = models.map(model => {
      const apiKey = process.env[`${model.provider.toUpperCase()}_API_KEY`];
      return {
        ...model,
        available: !!apiKey,
        apiKeyConfigured: !!apiKey,
      };
    });

    res.json({
      success: true,
      count: models.length,
      models: modelsWithStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/models/specialty/:specialty - Get models by specialty
router.get('/specialty/:specialty', (req, res) => {
  try {
    const { specialty } = req.params;
    const models = aiRouter.getAvailableModels();
    
    const filteredModels = models.filter(model =>
      model.specialty.includes(specialty.toLowerCase())
    );

    res.json({
      success: true,
      specialty,
      count: filteredModels.length,
      models: filteredModels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/models/recommend/:taskType - Get recommended model for task
router.get('/recommend/:taskType', (req, res) => {
  try {
    const { taskType } = req.params;
    const models = aiRouter.getAvailableModels();
    const modelIds = models.map(m => m.id);
    
    const bestModel = aiRouter.selectBestModel(taskType, modelIds);
    const modelInfo = models.find(m => m.id === bestModel);

    res.json({
      success: true,
      taskType,
      recommendedModel: modelInfo || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
