const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { watchFolder } = require('./sync');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// Handle sync start request
ipcMain.on('start-sync', async (event) => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (!result.canceled && result.filePaths.length > 0) {
    const folderPath = result.filePaths[0];
    watchFolder(folderPath);
    console.log(`📂 Watching ${folderPath}`);
  }
});

// Handle metadata request
ipcMain.handle('get-metadata', async () => {
  const metadataPath = path.join(__dirname, 'metadata.json');
  if (fs.existsSync(metadataPath)) {
    const content = fs.readFileSync(metadataPath, 'utf-8');
    return JSON.parse(content);
  }
  return {};
});
