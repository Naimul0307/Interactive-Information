// const { app, BrowserWindow, screen } = require('electron');
// const path = require('path');
// const net = require('net');

// // Function to check if a port is in use
// function isPortInUse(port, callback) {
//   const server = net.createServer();
//   server.once('error', (err) => {
//     if (err.code === 'EADDRINUSE') {
//       callback(true); // Port is in use
//     } else {
//       callback(false);
//     }
//   });
//   server.once('listening', () => {
//     server.close();
//     callback(false); // Port is free
//   });
//   server.listen(port);
// }

// // Function to create a browser window
// function createWindow(fileName, x, y) {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     fullscreen: true,
//     autoHideMenuBar: true,
//     x: x,
//     y: y,
//     webPreferences: {
//       contextIsolation: true,
//       nodeIntegration: false,
//     },
//   });
//   win.loadFile(path.join(__dirname, 'public', fileName));
// }

// // Electron app initialization
// app.whenReady().then(() => {
//   // Check if the server is already running
//   const PORT = process.env.PORT || 5003;
//   isPortInUse(PORT, (inUse) => {
//     if (!inUse) {
//       console.log(`Starting server on port ${PORT}...`);
//       require('child_process').exec(`node server.js`);
//     } else {
//       console.log(`Server already running on port ${PORT}.`);
//     }
//   });

//   // Get all monitors and open windows on them
//   const displays = screen.getAllDisplays();
//   const primaryDisplay = displays[0];
//   createWindow('index.html', primaryDisplay.bounds.x, primaryDisplay.bounds.y);

//   if (displays.length > 1) {
//     const secondDisplay = displays[1];
//     createWindow('videos.html', secondDisplay.bounds.x, secondDisplay.bounds.y);
//   }

//   app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//       app.quit();
//     }
//   });
// });


const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const net = require('net');

let secondWindow;

function isPortInUse(port, callback) {
  const server = net.createServer();
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      callback(true);
    } else {
      callback(false);
    }
  });
  server.once('listening', () => {
    server.close();
    callback(false);
  });
  server.listen(port);
}

function createWindow(fileName, x, y, options = {}) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    autoHideMenuBar: true,
    x: x,
    y: y,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Add preload script
      contextIsolation: true,
      nodeIntegration: false, // Disable require in renderer directly
    },
    ...options,
  });
  win.loadFile(path.join(__dirname, 'public', fileName));
  return win;
}

app.whenReady().then(() => {
  const PORT = process.env.PORT || 5003;
  isPortInUse(PORT, (inUse) => {
    if (!inUse) {
      console.log(`Starting server on port ${PORT}...`);
      require('child_process').exec(`node server.js`);
    } else {
      console.log(`Server already running on port ${PORT}.`);
    }
  });

  const displays = screen.getAllDisplays();
  const primaryDisplay = displays[0];
  const mainWindow = createWindow('index.html', primaryDisplay.bounds.x, primaryDisplay.bounds.y);

  if (displays.length > 1) {
    const secondDisplay = displays[1];
    secondWindow = createWindow('videos.html', secondDisplay.bounds.x, secondDisplay.bounds.y, {
      show: true,
    });
  }

  ipcMain.on('play-video', (event, videoName) => {
    if (secondWindow) {
      secondWindow.webContents.send('load-video', videoName);
      secondWindow.show();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});
