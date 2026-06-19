import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// GET /api/files/list - List files in directory
router.get('/list', async (req, res) => {
  try {
    const { dir } = req.query;
    const targetDir = dir || process.cwd();

    const items = await fs.readdir(targetDir, { withFileTypes: true });
    
    const files = await Promise.all(
      items.map(async (item) => {
        const stats = await fs.stat(path.join(targetDir, item.name));
        return {
          name: item.name,
          path: path.join(targetDir, item.name),
          isDirectory: item.isDirectory(),
          size: stats.size,
          modified: stats.mtime,
          extension: path.extname(item.name),
        };
      })
    );

    res.json({
      success: true,
      directory: targetDir,
      count: files.length,
      files: files.sort((a, b) => {
        // Directories first, then files
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/files/read - Read file content
router.get('/read', async (req, res) => {
  try {
    const { filePath } = req.query;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);

    res.json({
      success: true,
      path: filePath,
      content,
      size: stats.size,
      modified: stats.mtime,
      lines: content.split('\n').length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/files/write - Write file content
router.post('/write', async (req, res) => {
  try {
    const { filePath, content } = req.body;

    if (!filePath || content === undefined) {
      return res.status(400).json({ error: 'File path and content are required' });
    }

    await fs.writeFile(filePath, content, 'utf-8');

    res.json({
      success: true,
      path: filePath,
      message: 'File written successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/files/create - Create new file/directory
router.post('/create', async (req, res) => {
  try {
    const { filePath, isDirectory = false } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    if (isDirectory) {
      await fs.mkdir(filePath, { recursive: true });
    } else {
      await fs.writeFile(filePath, '', 'utf-8');
    }

    res.json({
      success: true,
      path: filePath,
      isDirectory,
      message: `${isDirectory ? 'Directory' : 'File'} created successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/files/delete - Delete file/directory
router.delete('/delete', async (req, res) => {
  try {
    const { filePath } = req.query;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }

    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      await fs.rm(filePath, { recursive: true, force: true });
    } else {
      await fs.unlink(filePath);
    }

    res.json({
      success: true,
      path: filePath,
      message: 'Deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
