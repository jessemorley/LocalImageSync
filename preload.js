const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startSync: (folderPath) => ipcRenderer.send('start-sync', folderPath),
});
