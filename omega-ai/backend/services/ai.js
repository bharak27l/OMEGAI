const axios = require('axios');

// Model configurations with providers
const MODELS = [
  {
    id: 'qwen3-coder',
    name: 'Qwen3 Coder',
    provider: 'openrouter',
    modelId: 'qwen/qwen3-coder',
    accuracy: 5,
    speed: 4,
    specialty: ['coding', 'code-generation', 'refactoring'],
    description: 'Best for complex coding tasks and code generation'
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'together',
    modelId: 'deepseek-ai/deepseek-v3',
    accuracy: 5,
    speed: 4,
    specialty: ['debugging', 'analysis', 'optimization'],
    description: 'Excellent for debugging and code analysis'
  },
  {
    id: 'kimi-k2',
    name: 'Kimi K2',
    provider: 'moonshot',
    modelId: 'moonshot/kimi-k2',
    accuracy: 5,
    speed: 3,
    specialty: ['architecture', 'design', 'planning'],
    description: 'Perfect for system architecture and design decisions'
  },
  {
    id: 'llama-4',
    name: 'Llama 4',
    provider: 'groq',
    modelId: 'meta-llama/llama-4',
    accuracy: 4,
    speed: 4,
    specialty: ['general', 'explanation', 'documentation'],
    description: 'Great all-around model for general tasks'
  },
  {
    id: 'gemma-3',
    name: 'Gemma 3',
    provider: 'groq',
    modelId: 'google/gemma-3',
    accuracy: 4,
    speed: 5,
    specialty: ['quick', 'simple', 'fast-response'],
    description: 'Fastest model for quick responses'
  },
  {
    id: 'mistral-small',
    name: 'Mistral Small',
    provider: 'groq',
    modelId: 'mistralai/mistral-small',
    accuracy: 4,
    speed: 5,
    specialty: ['quick', 'concise', 'efficient'],
    description: 'Efficient model for concise answers'
  }
];

// Task detection
function detectTaskType(message) {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('debug') || lowerMsg.includes('error') || lowerMsg.includes('bug') || lowerMsg.includes('fix')) {
    return 'debugging';
  }
  if (lowerMsg.includes('architect') || lowerMsg.includes('design') || lowerMsg.includes('structure') || lowerMsg.includes('pattern')) {
    return 'architecture';
  }
  if (lowerMsg.includes('write') || lowerMsg.includes('create') || lowerMsg.includes('generate') || lowerMsg.includes('implement')) {
    return 'coding';
  }
  if (lowerMsg.includes('explain') || lowerMsg.includes('what') || lowerMsg.includes('how does')) {
    return 'explanation';
  }
  if (lowerMsg.includes('optimize') || lowerMsg.includes('improve') || lowerMsg.includes('refactor')) {
    return 'optimization';
  }
  if (lowerMsg.includes('test') || lowerMsg.includes('unit test') || lowerMsg.includes('spec')) {
    return 'testing';
  }
  
  return 'general';
}

// Select best model for task
function selectBestModel(taskType, preferSpeed = false) {
  const relevantModels = MODELS.filter(m => 
    m.specialty.includes(taskType) || m.specialty.includes('general')
  );
  
  if (preferSpeed) {
    return relevantModels.sort((a, b) => b.speed - a.speed)[0];
  }
  
  return relevantModels.sort((a, b) => b.accuracy - a.speed)[0];
}

// Call AI API based on provider
async function callAIProvider(model, message, context = '') {
  const apiKey = getApiKeyForProvider(model.provider);
  
  if (!apiKey) {
    throw new Error(`API key not configured for ${model.provider}`);
  }

  switch (model.provider) {
    case 'openrouter':
      return callOpenRouter(model.modelId, message, context, apiKey);
    case 'together':
      return callTogetherAI(model.modelId, message, context, apiKey);
    case 'groq':
      return callGroq(model.modelId, message, context, apiKey);
    case 'moonshot':
      return callMoonshot(model.modelId, message, context, apiKey);
    default:
      throw new Error(`Unknown provider: ${model.provider}`);
  }
}

function getApiKeyForProvider(provider) {
  const keys = {
    openrouter: process.env.OPENROUTER_API_KEY,
    together: process.env.TOGETHER_API_KEY,
    groq: process.env.GROQ_API_KEY,
    moonshot: process.env.MOONSHOT_API_KEY
  };
  return keys[provider];
}

async function callOpenRouter(modelId, message, context, apiKey) {
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: modelId,
      messages: [
        { role: 'system', content: 'You are an expert AI coding assistant. Provide clear, accurate, and helpful responses.' },
        ...(context ? [{ role: 'system', content: `Context: ${context}` }] : []),
        { role: 'user', content: message }
      ]
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data.choices[0].message.content;
}

async function callTogetherAI(modelId, message, context, apiKey) {
  const response = await axios.post(
    'https://api.together.xyz/v1/chat/completions',
    {
      model: modelId,
      messages: [
        { role: 'system', content: 'You are an expert AI coding assistant.' },
        ...(context ? [{ role: 'system', content: `Context: ${context}` }] : []),
        { role: 'user', content: message }
      ]
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data.choices[0].message.content;
}

async function callGroq(modelId, message, context, apiKey) {
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: modelId,
      messages: [
        { role: 'system', content: 'You are an expert AI coding assistant.' },
        ...(context ? [{ role: 'system', content: `Context: ${context}` }] : []),
        { role: 'user', content: message }
      ]
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data.choices[0].message.content;
}

async function callMoonshot(modelId, message, context, apiKey) {
  const response = await axios.post(
    'https://api.moonshot.cn/v1/chat/completions',
    {
      model: modelId,
      messages: [
        { role: 'system', content: 'You are an expert AI coding assistant specializing in architecture.' },
        ...(context ? [{ role: 'system', content: `Context: ${context}` }] : []),
        { role: 'user', content: message }
      ]
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  return response.data.choices[0].message.content;
}

// Main processing function
async function processRequest(message, context = '', selectedModel = null) {
  let modelToUse;
  
  if (selectedModel && selectedModel !== 'auto') {
    modelToUse = MODELS.find(m => m.id === selectedModel);
  } else {
    const taskType = detectTaskType(message);
    modelToUse = selectBestModel(taskType);
  }

  if (!modelToUse) {
    modelToUse = MODELS.find(m => m.id === 'llama-4');
  }

  try {
    const startTime = Date.now();
    const response = await callAIProvider(modelToUse, message, context);
    const duration = Date.now() - startTime;

    return {
      response,
      model: modelToUse.id,
      modelName: modelToUse.name,
      provider: modelToUse.provider,
      taskType: detectTaskType(message),
      duration,
      alternatives: []
    };
  } catch (error) {
    console.error(`Error calling ${modelToUse.name}:`, error.message);
    
    // Fallback to another model
    const fallbackModel = MODELS.find(m => m.id !== modelToUse.id && m.provider !== modelToUse.provider);
    if (fallbackModel) {
      try {
        const response = await callAIProvider(fallbackModel, message, context);
        return {
          response,
          model: fallbackModel.id,
          modelName: fallbackModel.name,
          provider: fallbackModel.provider,
          fallback: true,
          originalError: error.message
        };
      } catch (fallbackError) {
        throw new Error(`All models failed. Last error: ${fallbackError.message}`);
      }
    }
    
    throw error;
  }
}

// Compare multiple models
async function compareModels(message, context = '', modelIds = null) {
  const modelsToCompare = modelIds 
    ? MODELS.filter(m => modelIds.includes(m.id))
    : MODELS.slice(0, 3); // Default: top 3 models

  const results = await Promise.allSettled(
    modelsToCompare.map(async (model) => {
      try {
        const startTime = Date.now();
        const response = await callAIProvider(model, message, context);
        return {
          model: model.id,
          modelName: model.name,
          response,
          duration: Date.now() - startTime,
          success: true
        };
      } catch (error) {
        return {
          model: model.id,
          modelName: model.name,
          error: error.message,
          success: false
        };
      }
    })
  );

  return results.map(r => r.value);
}

// Get available models
async function getAvailableModels() {
  return MODELS.map(m => ({
    id: m.id,
    name: m.name,
    provider: m.provider,
    accuracy: m.accuracy,
    speed: m.speed,
    specialty: m.specialty,
    description: m.description
  }));
}

module.exports = {
  processRequest,
  compareModels,
  getAvailableModels,
  MODELS,
  detectTaskType,
  selectBestModel
};
