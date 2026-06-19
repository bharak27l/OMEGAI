const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
const aiRouter = require('./routes/ai');
const fileRouter = require('./routes/files');
const terminalRouter = require('./routes/terminal');
const memoryRouter = require('./routes/memory');

app.use('/api/ai', aiRouter);
app.use('/api/files', fileRouter);
app.use('/api/terminal', terminalRouter);
app.use('/api/memory', memoryRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Omega AI Backend is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Omega AI Backend running on port ${PORT}`);
  console.log(`📡 Available models: Qwen3-Coder, DeepSeek-V3, Kimi K2, Llama 4, Gemma 3, Mistral Small`);
});
