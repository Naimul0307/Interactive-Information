const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const net = require('net');

// Function to check if a port is in use
function isPortInUse(port, callback) {
  const server = net.createServer();
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      callback(true); // Port is in use
    } else {
      callback(false);
    }
  });
  server.once('listening', () => {
    server.close();
    callback(false); // Port is free
  });
  server.listen(port);
}

// Function to create a browser window
function createWindow(fileName, x, y) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    x: x,
    y: y,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, 'public', fileName));
}

// Electron app initialization
app.whenReady().then(() => {
  // Check if the server is already running
  const PORT = process.env.PORT || 5003;
  isPortInUse(PORT, (inUse) => {
    if (!inUse) {
      console.log(`Starting server on port ${PORT}...`);
      require('child_process').exec(`node server.js`);
    } else {
      console.log(`Server already running on port ${PORT}.`);
    }
  });

  // Get all monitors and open windows on them
  const displays = screen.getAllDisplays();
  const primaryDisplay = displays[0];
  createWindow('index.html', primaryDisplay.bounds.x, primaryDisplay.bounds.y);

  if (displays.length > 1) {
    const secondDisplay = displays[1];
    createWindow('videos.html', secondDisplay.bounds.x, secondDisplay.bounds.y);
  }

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});
