# 🚀 Omega AI Desktop

**Multi-Model AI Coding Assistant for Ubuntu**

A powerful desktop application that combines multiple free AI models with intelligent routing to provide the best coding assistance available.

## Features

### 🎯 Smart Model Routing
- **Auto-detects task type** (coding, debugging, architecture, explanation)
- **Automatically selects the best model** for each task
- **Queries multiple models in parallel** and returns the best response
- Shows alternative responses from other models

### 🤖 8+ Free AI Models Supported
| Model | Specialty | Provider | Speed | Accuracy |
|-------|-----------|----------|-------|----------|
| Qwen3 Coder | Coding, Code Review | OpenRouter | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| DeepSeek V3 | Debugging, Testing | Together AI | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Kimi K2 | Architecture, Design | Moonshot | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Llama 4 | General Purpose | Groq | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Gemma 3 | Fast Responses | Groq | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Mistral Small | Quick Tasks | Groq | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| CodeLlama | Code Generation | HuggingFace | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| StarCoder2 | Code Completion | HuggingFace | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### 📁 File Management
- Browse project files
- Read/write code files
- Create/delete files and directories
- Integrated with AI for file operations

### ⌨️ Terminal Integration
- Execute commands directly from the app
- Secure command filtering
- View command output

### 🧠 Memory System
- Conversation history
- Global memory notes
- Context preservation across sessions

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Ubuntu 20.04+ (or any Linux/Windows/macOS)

### 1. Clone and Install Dependencies

```bash
cd omega-ai

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Configure API Keys

Copy the environment example file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your free API keys:

```env
# Get free keys from:
# - OpenRouter: https://openrouter.ai/keys
# - Together AI: https://together.ai/
# - Groq: https://groq.com/
# - Moonshot: https://platform.moonshot.cn/
# - HuggingFace: https://huggingface.co/settings/tokens

OPENROUTER_API_KEY=your_key_here
TOGETHER_AI_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
MOONSHOT_API_KEY=your_key_here
HUGGINGFACE_API_KEY=your_key_here
```

### 3. Run the Application

#### Development Mode

Terminal 1 - Start Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Start Frontend:
```bash
cd frontend
npm run dev
```

#### Build Electron Desktop App

```bash
npm run electron:build
```

The built app will be in the `dist/` folder.

## Usage

### Chat Interface
1. Select which models to use (or enable Auto-Select)
2. Type your coding question
3. The AI Router automatically:
   - Detects your task type
   - Selects the best model
   - Returns the response with alternatives

### Task Detection Examples
- "Fix this bug..." → **DeepSeek V3** (debugging specialist)
- "Write a function..." → **Qwen3 Coder** (coding specialist)
- "Design a scalable architecture..." → **Kimi K2** (architecture expert)
- "Explain how this works..." → **Llama 4** (explanation expert)

### Keyboard Shortcuts
- `Enter` - Send message
- `Shift + Enter` - New line in input

## Project Structure

```
omega-ai/
├── frontend/              # React + Vite + Electron
│   ├── electron/          # Electron main process
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utility functions
│   └── dist/              # Built frontend
├── backend/               # Node.js + Express
│   ├── ai/                # AI router and models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── database/          # Database connectors
├── models/                # Local model configs
├── memory/                # Memory storage
├── cache/                 # Response cache
└── config/                # Configuration files
```

## API Endpoints

### Chat
- `POST /api/chat` - Send message to AI
- `GET /api/chat/models` - Get available models

### Models
- `GET /api/models` - List all models
- `GET /api/models/specialty/:type` - Filter by specialty
- `GET /api/models/recommend/:task` - Get recommendation

### Files
- `GET /api/files/list` - List directory
- `GET /api/files/read` - Read file
- `POST /api/files/write` - Write file
- `POST /api/files/create` - Create file/dir
- `DELETE /api/files/delete` - Delete file

### Terminal
- `POST /api/terminal/execute` - Execute command

### Memory
- `POST /api/memory/save` - Save conversation
- `GET /api/memory/get/:id` - Get conversation
- `GET /api/memory/list` - List conversations
- `POST /api/memory/global` - Add global note
- `GET /api/memory/global` - Search global notes

## Why Multi-Model?

No single AI model excels at everything. Omega AI's multi-model approach:

1. **Better Accuracy**: Different models have different strengths
2. **Fallback Options**: If one model fails, others can respond
3. **Task Optimization**: Right model for each job
4. **Comparison**: See alternative solutions side-by-side
5. **Free Tier Maximization**: Use multiple free APIs instead of paid

## Contributing

Contributions welcome! Areas for improvement:
- Add more free model providers
- Improve task detection algorithm
- Add RAG (Retrieval Augmented Generation)
- GitHub repository analysis
- Local model fallback (Ollama integration)
- Plugin system

## License

MIT License - Free for personal and commercial use

## Acknowledgments

Thanks to all the open-source AI model providers offering free tiers:
- OpenRouter
- Together AI
- Groq
- Moonshot AI
- Hugging Face
- Meta (Llama)
- Google (Gemma)
- Mistral AI

---

Built with ❤️ for the Ubuntu/Linux community
