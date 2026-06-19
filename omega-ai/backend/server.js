import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import chatRoutes from './routes/chat.js';
import modelsRoutes from './routes/models.js';
import filesRoutes from './routes/files.js';
import terminalRoutes from './routes/terminal.js';
import memoryRoutes from './routes/memory.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/models', modelsRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/terminal', terminalRoutes);
app.use('/api/memory', memoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: err.message || 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║           🚀 Omega AI Backend Ready            ║
╠════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}     ║
║  Environment: ${process.env.NODE_ENV || 'development'}                       ║
║                                                ║
║  Available Models:                             ║
║  • Qwen3 Coder      (Coding specialist)        ║
║  • DeepSeek V3      (Debugging expert)         ║
║  • Kimi K2          (Architecture design)      ║
║  • Llama 4          (General purpose)          ║
║  • Gemma 3          (Fast responses)           ║
║  • Mistral Small    (Quick tasks)              ║
║  • CodeLlama        (Code generation)          ║
║  • StarCoder2       (Code completion)          ║
╚════════════════════════════════════════════════╝
  `);
});

export default app;
