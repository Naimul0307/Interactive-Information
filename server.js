const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = 3000;

// Serve static files from the public folder
app.use(express.static('public'));

// Use Helmet to set security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        mediaSrc: ["'self'"],
      },
    },
  })
);

// Endpoint to dynamically fetch video files
app.get('/videos', (req, res) => {
  const videoDir = path.join(__dirname, 'public/videos');
  fs.readdir(videoDir, (err, files) => {
    if (err) {
      res.status(500).send('Error reading video directory');
    } else {
      // Log the fetched files
      console.log('Fetched files:', files);

      const videoFiles = files.filter(file => file.endsWith('.mp4'));
      console.log('Filtered mp4 files:', videoFiles);

      res.json(videoFiles);
    }
  });
});

// Fallback for index.html if needed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
