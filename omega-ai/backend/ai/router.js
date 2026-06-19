// Multi-Model AI Router with Smart Task Detection
import axios from 'axios';

const MODEL_CONFIGS = {
  'qwen3-coder': {
    provider: 'openrouter',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'qwen/qwen-2.5-coder-32b-instruct',
    specialty: ['coding', 'code-review', 'refactoring'],
    maxTokens: 4096,
    priority: 1,
  },
  'deepseek-v3': {
    provider: 'together',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    model: 'deepseek-ai/deepseek-v3',
    specialty: ['debugging', 'error-analysis', 'testing'],
    maxTokens: 4096,
    priority: 1,
  },
  'kimi-k2': {
    provider: 'moonshot',
    endpoint: 'https://api.moonshot.cn/v1/chat/completions',
    model: 'kimi-k2',
    specialty: ['architecture', 'design', 'planning'],
    maxTokens: 8192,
    priority: 1,
  },
  'llama4': {
    provider: 'groq',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-4-70b-versatile',
    specialty: ['general', 'explanation', 'documentation'],
    maxTokens: 4096,
    priority: 2,
  },
  'gemma3': {
    provider: 'groq',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'gemma-7b-it',
    specialty: ['fast', 'quick-response', 'simple-tasks'],
    maxTokens: 2048,
    priority: 3,
  },
  'mistral-small': {
    provider: 'groq',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'mistral-small',
    specialty: ['quick', 'summarization', 'brief'],
    maxTokens: 2048,
    priority: 3,
  },
  'codellama': {
    provider: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/meta-llama/CodeLlama-34b-Instruct-hf',
    model: 'codellama-34b',
    specialty: ['code-generation', 'completion'],
    maxTokens: 2048,
    priority: 2,
  },
  'starcoder2': {
    provider: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/bigcode/starcoder2-15b',
    model: 'starcoder2-15b',
    specialty: ['completion', 'fill-in-middle'],
    maxTokens: 2048,
    priority: 2,
  },
};

class AIRouter {
  constructor() {
    this.apiKeys = {
      openrouter: process.env.OPENROUTER_API_KEY,
      together: process.env.TOGETHER_AI_API_KEY,
      moonshot: process.env.MOONSHOT_API_KEY,
      groq: process.env.GROQ_API_KEY,
      huggingface: process.env.HUGGINGFACE_API_KEY,
    };
    this.requestTimeout = 30000;
  }

  // Detect task type from user input
  detectTaskType(message) {
    const lower = message.toLowerCase();
    
    const patterns = {
      debugging: ['bug', 'error', 'fix', 'broken', 'not working', 'exception', 'crash', 'issue'],
      architecture: ['architecture', 'design', 'structure', 'pattern', 'scalable', 'system design'],
      coding: ['write', 'create', 'implement', 'build', 'develop', 'function', 'class', 'code'],
      'code-review': ['review', 'improve', 'optimize', 'refactor', 'better way'],
      explanation: ['explain', 'what', 'how', 'why', 'understand', 'teach'],
      testing: ['test', 'unit test', 'integration', 'mock', 'assert'],
      documentation: ['document', 'comment', 'readme', 'docs'],
    };

    for (const [type, keywords] of Object.entries(patterns)) {
      if (keywords.some(keyword => lower.includes(keyword))) {
        return type;
      }
    }

    return 'general';
  }

  // Select best model for task
  selectBestModel(taskType, availableModels) {
    const modelPriority = {
      debugging: ['deepseek-v3', 'qwen3-coder', 'codellama'],
      architecture: ['kimi-k2', 'llama4', 'qwen3-coder'],
      coding: ['qwen3-coder', 'deepseek-v3', 'codellama'],
      'code-review': ['qwen3-coder', 'deepseek-v3', 'llama4'],
      explanation: ['llama4', 'gemma3', 'mistral-small'],
      testing: ['deepseek-v3', 'qwen3-coder', 'codellama'],
      documentation: ['llama4', 'gemma3', 'mistral-small'],
      general: ['llama4', 'gemma3', 'mistral-small'],
    };

    const priority = modelPriority[taskType] || modelPriority.general;
    
    // Find first available model from priority list
    for (const modelId of priority) {
      if (availableModels.includes(modelId)) {
        return modelId;
      }
    }

    // Fallback to first available model
    return availableModels[0] || 'qwen3-coder';
  }

  // Make request to specific model
  async queryModel(modelId, messages, options = {}) {
    const config = MODEL_CONFIGS[modelId];
    if (!config) {
      throw new Error(`Unknown model: ${modelId}`);
    }

    const apiKey = this.apiKeys[config.provider];
    if (!apiKey) {
      throw new Error(`API key not configured for ${config.provider}`);
    }

    const payload = {
      model: config.model,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      max_tokens: options.maxTokens || config.maxTokens,
      temperature: options.temperature || 0.7,
      stream: false,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    // Add provider-specific headers
    switch (config.provider) {
      case 'openrouter':
        headers['Authorization'] = `Bearer ${apiKey}`;
        headers['HTTP-Referer'] = 'https://omega-ai.local';
        break;
      case 'together':
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
      case 'moonshot':
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
      case 'groq':
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
      case 'huggingface':
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
    }

    try {
      const response = await axios.post(config.endpoint, payload, {
        headers,
        timeout: this.requestTimeout,
      });

      // Parse response based on provider format
      let content;
      if (response.data.choices && response.data.choices[0]) {
        content = response.data.choices[0].message?.content || '';
      } else if (response.data.generated_text) {
        content = response.data.generated_text;
      } else {
        content = JSON.stringify(response.data);
      }

      return {
        success: true,
        content,
        model: modelId,
        provider: config.provider,
        usage: response.data.usage || {},
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        model: modelId,
        provider: config.provider,
      };
    }
  }

  // Query multiple models and return best response
  async queryMultipleModels(models, messages, taskType = 'general') {
    const results = [];
    const startTime = Date.now();

    // Query all selected models in parallel
    const promises = models.map(async (modelId) => {
      const result = await this.queryModel(modelId, messages);
      result.responseTime = Date.now() - startTime;
      return result;
    });

    const allResults = await Promise.allSettled(promises);

    for (const result of allResults) {
      if (result.status === 'fulfilled' && result.value) {
        results.push(result.value);
      }
    }

    // Select best response based on task type and quality
    const successfulResults = results.filter(r => r.success);

    if (successfulResults.length === 0) {
      return {
        response: 'All models failed to respond. Please check your API keys and try again.',
        model: 'none',
        alternatives: [],
        error: true,
      };
    }

    // Sort by response time for fast tasks, otherwise by model priority
    const sortedResults = successfulResults.sort((a, b) => {
      const configA = MODEL_CONFIGS[a.model];
      const configB = MODEL_CONFIGS[b.model];
      
      if (taskType === 'fast' || taskType === 'quick') {
        return a.responseTime - b.responseTime;
      }
      
      return (configA?.priority || 99) - (configB?.priority || 99);
    });

    const bestResult = sortedResults[0];
    const alternatives = sortedResults.slice(1).map(r => ({
      model: r.model,
      content: r.content,
      responseTime: r.responseTime,
    }));

    return {
      response: bestResult.content,
      model: bestResult.model,
      provider: bestResult.provider,
      responseTime: bestResult.responseTime,
      alternatives,
      allResults: sortedResults,
    };
  }

  // Get all available models info
  getAvailableModels() {
    return Object.entries(MODEL_CONFIGS).map(([id, config]) => ({
      id,
      name: config.model.split('/').pop(),
      provider: config.provider,
      specialty: config.specialty,
      maxTokens: config.maxTokens,
      priority: config.priority,
    }));
  }
}

export default new AIRouter();
