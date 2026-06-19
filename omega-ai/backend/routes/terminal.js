import express from 'express';
import { exec } from 'child_process';
import path from 'path';

const router = express.Router();

// POST /api/terminal/execute - Execute terminal command
router.post('/execute', async (req, res) => {
  try {
    const { command, cwd } = req.body;

    if (!command || !command.trim()) {
      return res.status(400).json({ error: 'Command is required' });
    }

    // Security: Block dangerous commands
    const dangerousPatterns = [
      'rm -rf /',
      'sudo rm',
      'dd if=',
      ':(){:|:&};:',
      'chmod -R 777 /',
      'mkfs',
      '> /dev/',
    ];

    for (const pattern of dangerousPatterns) {
      if (command.toLowerCase().includes(pattern)) {
        return res.status(403).json({ 
          error: 'Command blocked for security reasons' 
        });
      }
    }

    const workingDir = cwd || process.cwd();

    exec(command, { 
      cwd: workingDir,
      timeout: 30000,
      maxBuffer: 1024 * 1024,
    }, (error, stdout, stderr) => {
      res.json({
        success: !error,
        command,
        output: stdout || stderr,
        exitCode: error?.code || 0,
        error: error ? error.message : null,
      });
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// GET /api/terminal/pwd - Get current working directory
router.get('/pwd', (req, res) => {
  res.json({
    cwd: process.cwd(),
  });
});

export default router;
