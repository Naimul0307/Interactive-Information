const { contextBridge, ipcRenderer } = require('electron');

// Expose IPC Renderer safely to the renderer process
contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {
    // Validate channel if needed
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});
