const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startSync: () => ipcRenderer.send('start-sync'),
  requestMetadata: () => ipcRenderer.invoke('get-metadata')
});

console.log("✅ Preload loaded");
