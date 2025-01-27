// // Get video name from URL
// const urlParams = new URLSearchParams(window.location.search);
// const videoName = urlParams.get('video');

// // Play the video if video name is present
// if (videoName) {
//   const modal = document.getElementById('videoModal');
//   const video = document.getElementById('infoVideo');
//   const source = document.getElementById('videoSource');

//   // Ensure video is loaded correctly
//   source.src = `videos/${videoName}`; // Set the video source
//   video.load(); 

//   // Open modal and play video
//   modal.style.display = 'flex'; // Show the modal on second screen
//   setTimeout(() => {
//     video.play(); // Play the video
//   }, 100);

//   // Redirect after video ends
//   video.addEventListener('ended', function () {
//     modal.style.display = 'none';
//     video.pause();
//   });
// }

// Function to close the modal
function closeModal() {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('infoVideo');

  modal.style.display = 'none';
  video.pause();
}

window.electron.receive('load-video', (videoName) => {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('infoVideo');
  const source = document.getElementById('videoSource');

  source.src = `videos/${videoName}`; // Set the video source
  video.load();

  modal.style.display = 'flex'; // Show the modal
  setTimeout(() => {
    video.play();
  }, 100);

  video.addEventListener('ended', function () {
    modal.style.display = 'none';
    video.pause();
  });
});
