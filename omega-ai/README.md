# Omega AI Desktop

A powerful multi-model AI coding assistant desktop application with automatic model routing.

## Features

- **🤖 6+ AI Models**: Qwen3-Coder, DeepSeek-V3, Kimi K2, Llama 4, Gemma 3, Mistral Small
- **🎯 Smart Auto-Routing**: Automatically selects the best AI model for your task
- **📁 File Management**: Browse, read, edit, create, and delete files
- **⌨️ Terminal Integration**: Execute shell commands directly
- **🧠 Memory & History**: Persistent conversation storage
- **🖥️ Desktop App**: Built with Electron for Windows, macOS, and Linux

## Installation from .deb Package

### Double-click to Install (GUI)
1. Download `Omega-AI-Desktop_1.0.0_amd64.deb`
2. Double-click the file
3. Click "Install" in the software center
4. Launch from Applications menu

### Command Line Installation
```bash
sudo dpkg -i Omega-AI-Desktop_1.0.0_amd64.deb
sudo apt-get install -f  # Fix any dependencies
```

## Building from Source

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your API keys
npm start
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev  # Development mode
```

### Build .deb Package
```bash
cd frontend
npm install
npm run electron:build
```

The .deb package will be created in `frontend/dist/`

## API Keys

Get free API keys from:
- **OpenRouter**: https://openrouter.ai/keys (for Qwen3-Coder)
- **Together AI**: https://together.ai/ (for DeepSeek-V3)
- **Groq**: https://groq.com/ (for Llama 4, Gemma 3, Mistral Small)
- **Moonshot AI**: https://platform.moonshot.cn/ (for Kimi K2)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| F1 | Open Help |
| Esc | Close Help/Modals |
| Enter | Send message |
| Shift+Enter | New line in chat |

## Project Structure

```
omega-ai/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── ai.js
│   │   ├── files.js
│   │   ├── terminal.js
│   │   └── memory.js
│   └── services/
│       └── ai.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── electron/
│   │   └── main.js
│   └── package.json
└── assets/
    └── logo.png
```

## License

MIT License
