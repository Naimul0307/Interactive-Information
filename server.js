const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;

console.log(`Server will run on PORT: ${PORT}`);

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
app.use(express.static('public')); // This line serves static files like videos

app.get('/videos', (req, res) => {
  const videoDir = path.join(__dirname, 'public', 'videos');
  fs.readdir(videoDir, (err, files) => {
    if (err) {
      res.status(500).send('Error reading video directory');
    } else {
      const videoFiles = files.filter((file) => file.endsWith('.mp4'));
      res.json(videoFiles); // Send the list of video files
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
