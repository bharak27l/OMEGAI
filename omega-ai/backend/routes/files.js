const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const WORKSPACE_DIR = process.env.WORKSPACE_DIR || '/tmp/omega-workspace';

// Ensure workspace directory exists
router.use(async (req, res, next) => {
  try {
    await fs.mkdir(WORKSPACE_DIR, { recursive: true });
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workspace directory' });
  }
});

// List files in directory
router.get('/list', async (req, res) => {
  try {
    const dirPath = req.query.path ? path.join(WORKSPACE_DIR, req.query.path) : WORKSPACE_DIR;
    const safePath = path.normalize(dirPath);
    
    if (!safePath.startsWith(WORKSPACE_DIR)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const files = await fs.readdir(safePath, { withFileTypes: true });
    const fileList = files.map(file => ({
      name: file.name,
      isDirectory: file.isDirectory(),
      path: path.join(req.query.path || '', file.name)
    }));

    res.json(fileList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read file content
router.get('/read', async (req, res) => {
  try {
    const filePath = path.join(WORKSPACE_DIR, req.query.path);
    const safePath = path.normalize(filePath);
    
    if (!safePath.startsWith(WORKSPACE_DIR)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const content = await fs.readFile(safePath, 'utf-8');
    res.json({ content, path: req.query.path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Write file content
router.post('/write', async (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    
    if (!filePath || content === undefined) {
      return res.status(400).json({ error: 'Path and content are required' });
    }

    const fullPath = path.join(WORKSPACE_DIR, filePath);
    const safePath = path.normalize(fullPath);
    
    if (!safePath.startsWith(WORKSPACE_DIR)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await fs.mkdir(path.dirname(safePath), { recursive: true });
    await fs.writeFile(safePath, content, 'utf-8');
    
    res.json({ success: true, path: filePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create directory
router.post('/mkdir', async (req, res) => {
  try {
    const { path: dirPath } = req.body;
    
    if (!dirPath) {
      return res.status(400).json({ error: 'Path is required' });
    }

    const fullPath = path.join(WORKSPACE_DIR, dirPath);
    const safePath = path.normalize(fullPath);
    
    if (!safePath.startsWith(WORKSPACE_DIR)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await fs.mkdir(safePath, { recursive: true });
    res.json({ success: true, path: dirPath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file or directory
router.delete('/delete', async (req, res) => {
  try {
    const filePath = path.join(WORKSPACE_DIR, req.query.path);
    const safePath = path.normalize(filePath);
    
    if (!safePath.startsWith(WORKSPACE_DIR)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const stats = await fs.stat(safePath);
    
    if (stats.isDirectory()) {
      await fs.rm(safePath, { recursive: true, force: true });
    } else {
      await fs.unlink(safePath);
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
