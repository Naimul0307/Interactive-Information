// Get video name from URL
const urlParams = new URLSearchParams(window.location.search);
const videoName = urlParams.get('video');

// Play the video if video name is present
if (videoName) {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('infoVideo');
  const source = document.getElementById('videoSource');

  // Ensure video is loaded correctly
  source.src = `videos/${videoName}`;
  video.load();

  // Open modal and play video
  modal.style.display = 'flex';
  
  // Delay to allow video to load and then start playing
  setTimeout(() => {
    video.play();
  }, 100);

  // Redirect after video ends
  video.addEventListener('ended', function() {
    window.location.href = 'index.html'; // Redirect to index.html after video ends
  });
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('infoVideo');

  modal.style.display = 'none';
  video.pause(); // Pause the video
  video.currentTime = 0; // Reset the video to the beginning
  // Ensure the redirection occurs even if the modal is closed manually
  window.location.href = 'index.html'; // Redirect to index.html after closing the modal
}
