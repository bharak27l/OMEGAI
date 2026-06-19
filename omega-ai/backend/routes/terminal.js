const express = require('express');
const router = express.Router();
const pty = require('node-pty');
const os = require('os');

const sessions = new Map();

// Create new terminal session
router.post('/create', (req, res) => {
  try {
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    const session = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.WORKSPACE_DIR || '/tmp/omega-workspace',
      env: process.env
    });

    const sessionId = Math.random().toString(36).substring(7);
    sessions.set(sessionId, session);

    let output = '';
    session.onData(data => {
      output += data;
    });

    res.json({ sessionId, output: '' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Write to terminal
router.post('/write', (req, res) => {
  try {
    const { sessionId, command } = req.body;
    
    if (!sessionId || !command) {
      return res.status(400).json({ error: 'Session ID and command are required' });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.write(command + '\r');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get terminal output
router.get('/output/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Note: In a real implementation, you'd buffer the output
    res.json({ output: '' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Close terminal session
router.delete('/close/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);
    
    if (session) {
      session.kill();
      sessions.delete(sessionId);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
