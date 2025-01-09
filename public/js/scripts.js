let firstTouchInteraction = true; // Flag to track the first touch interaction

// Function to fetch videos dynamically and create buttons
// function loadVideoButtons() {
//   // fetch('/videos')
//   //   .then(response => response.json())
//   //   .then(videos => {
//   //     const buttonsContainer = document.getElementById('floating-buttons');
//   //     buttonsContainer.innerHTML = ''; // Clear any existing buttons

//   //     // Generate dynamic video buttons
//   //     videos.forEach((video, index) => {
//   //       const button = document.createElement('button');
//   //       button.textContent = video.split('.')[0]; // Use the video file name as button text
//   //       button.className = 'float-btn';
//   //       button.draggable = true;
//   //       button.id = `video-btn-${index}`; // Add unique ID
//   //       button.setAttribute('data-video', video);

//   //       // Add event listeners for both mouse and touch interactions
//   //       button.addEventListener('dragstart', (e) => drag(e)); // Mouse drag
//   //       button.addEventListener('touchstart', (e) => touchStart(e)); // Touch start
        
//   //       buttonsContainer.appendChild(button);
//   //     });
//   //   })
//   //   .catch(error => console.error('Error loading videos:', error));

//   fetch('http://localhost:5003/videos')
//   .then(response => response.json())
//   .then(videos => {
//     console.log('Fetched videos:', videos); // Check if the videos are being fetched correctly
//     loadVideoButtons(videos);
//   })
//   .catch(error => {
//     console.error('Error loading videos:', error);
//   });

// }


// Function to fetch videos dynamically and create buttons
function loadVideoButtons() {
  fetch('http://localhost:5003/videos')  // Fetching video data from server
    .then(response => response.json())
    .then(videos => {
      console.log('Fetched videos:', videos);  // Check if the videos are being fetched correctly
      const buttonsContainer = document.getElementById('floating-buttons');
      buttonsContainer.innerHTML = '';  // Clear any existing buttons

      // Generate dynamic video buttons
      videos.forEach((video, index) => {
        const button = document.createElement('button');
        button.textContent = video.split('.')[0]; // Use the video file name as button text
        button.className = 'float-btn';
        button.draggable = true;
        button.id = `video-btn-${index}`;  // Add unique ID
        button.setAttribute('data-video', video);

        // Add event listeners for both mouse and touch interactions
        button.addEventListener('dragstart', (e) => drag(e));  // Mouse drag
        button.addEventListener('touchstart', (e) => touchStart(e));  // Touch start

        buttonsContainer.appendChild(button);
      });
    })
    .catch(error => {
      console.error('Error loading videos:', error);
    });
}


// Function to handle drag start (mouse)
function drag(e) {
  e.dataTransfer.setData('video', e.target.getAttribute('data-video'));
}

// Function to handle touch start
function touchStart(e) {
  const videoName = e.target.getAttribute('data-video');
  e.preventDefault(); // Prevent default touch behavior
  
  // Create a custom drag element for touch
  const dragElement = e.target;
  const touch = e.touches[0];

  dragElement.style.position = 'absolute';
  dragElement.style.zIndex = '9999';
  dragElement.style.left = touch.pageX - dragElement.offsetWidth / 2 + 'px';
  dragElement.style.top = touch.pageY - dragElement.offsetHeight / 2 + 'px';

  // Track touch movement
  document.addEventListener('touchmove', (moveEvent) => {
    moveEvent.preventDefault(); // Prevent scrolling
    dragElement.style.left = moveEvent.touches[0].pageX - dragElement.offsetWidth / 2 + 'px';
    dragElement.style.top = moveEvent.touches[0].pageY - dragElement.offsetHeight / 2 + 'px';
  });

  document.addEventListener('touchend', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    const touch = e.changedTouches[0]; // Get the final touch
    const bin = document.getElementById('bin');

    // Check if dropped on bin
    if (isTouchOverBin(bin, touch)) {
      if (firstTouchInteraction) {
        // For the first interaction, manually play the video
        playVideo(videoName);
        firstTouchInteraction = false; // Set flag to false after the first interaction
      } else {
        // For subsequent interactions, play the video automatically
        playVideo(videoName);
      }
    }

    resetDragElement(dragElement); // Reset drag element position
  });
}

// Function to check if touch is over the bin
function isTouchOverBin(bin, touch) {
  const binRect = bin.getBoundingClientRect();
  return (
    touch.pageX >= binRect.left &&
    touch.pageX <= binRect.right &&
    touch.pageY >= binRect.top &&
    touch.pageY <= binRect.bottom
  );
}

// Reset the dragged element after the drop (works for both touch and mouse)
function resetDragElement(dragElement) {
  dragElement.style.position = '';
  dragElement.style.left = '';
  dragElement.style.top = '';
  dragElement.style.zIndex = '';
}

// Function to allow drop in the bin (works for both mouse and touch)
function allowDrop(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Function to handle the drop (mouse)
function drop(e) {
  e.preventDefault();
  const videoName = e.dataTransfer.getData('video'); // Get the video name from dragged button
  playVideo(videoName); // Play the video
}

// Function to play a video
function playVideo(videoName) {
  window.location.href = `videos.html?video=${encodeURIComponent(videoName)}`;
}

// Load video buttons on page load
document.addEventListener('DOMContentLoaded', () => {
  loadVideoButtons();
});

// Enable drop on the bin (works for both mouse and touch)
const bin = document.getElementById('bin');

// Allow drop for both mouse and touch
bin.addEventListener('dragover', allowDrop);
bin.addEventListener('drop', drop);
bin.addEventListener('touchmove', allowDrop); // Allow touch drop
bin.addEventListener('touchend', (e) => {
  e.preventDefault();
  const touch = e.changedTouches[0]; // Get final touch point
  const videoName = e.target.getAttribute('data-video');
  if (isTouchOverBin(bin, touch)) {
    if (firstTouchInteraction) {
      playVideo(videoName); // Play the video manually on first touch
      firstTouchInteraction = false; // Set flag to false after first interaction
    } else {
      playVideo(videoName); // Play video normally after first touch
    }
  }
});
