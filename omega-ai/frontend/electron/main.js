const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/icon.png'),
    title: 'Omega AI Desktop',
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for frontend-backend communication
ipcMain.handle('send-to-backend', async (event, data) => {
  const axios = require('axios');
  try {
    const response = await axios.post('http://localhost:5000/api/chat', data);
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle('get-models', async () => {
  const axios = require('axios');
  try {
    const response = await axios.get('http://localhost:5000/api/models');
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
});
