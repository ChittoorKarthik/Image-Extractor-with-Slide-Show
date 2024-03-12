// Define global variables to store image URLs and current index
var imageUrls = [];
var currentIndex = 0;


// Define a variable to store the slideshow interval ID
var slideshowInterval;
// Function to start the slideshow
function startSlideshow() {
    // Stop any existing slideshow
    stopSlideshow();
    // Start the slideshow by calling nextImage every 7 seconds
    slideshowInterval = setInterval(nextImage, 7000);
}

// Function to stop the slideshow
function stopSlideshow() {
    // Clear the interval if it exists
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
}



// Function to display image at given index
function displayImage(index) {
    var imageUrl = imageUrls[index];
    var imageDisplay = document.getElementById("imageDisplay");
    imageDisplay.src = imageUrl;

    // Reset any previous styling
    imageDisplay.style.width = 'auto';
    imageDisplay.style.height = 'auto';
    imageDisplay.style.objectFit = 'contain'; // Maintain aspect ratio without cropping

    // Calculate the aspect ratio of the original image
    var img = new Image();
    img.onload = function() {
        var aspectRatio = img.width / img.height;
        
        // Calculate the new dimensions while maintaining the aspect ratio
        var containerWidth = 0.9 * window.innerWidth; // 90% of window width
        var containerHeight = 0.9 * window.innerHeight; // 90% of window height
        var containerAspectRatio = containerWidth / containerHeight;

        if (aspectRatio > containerAspectRatio) {
            // Image is wider than the container, set width to container width
            imageDisplay.style.width = containerWidth + 'px';
            imageDisplay.style.height = 'auto';
        } else {
            // Image is taller than the container, set height to container height
            imageDisplay.style.height = containerHeight + 'px';
            imageDisplay.style.width = 'auto';
        }
    };
    img.src = imageUrl;

    // Ensure the image appears above the overlay
    imageDisplay.style.zIndex = '10001';
}




// Function to display previous image
function prevImage() {
    currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
    displayImage(currentIndex);
}

// Function to display next image
function nextImage() {
    currentIndex = (currentIndex + 1) % imageUrls.length;
    console.log("currentIndex=",currentIndex);
    displayImage(currentIndex);
}

// Listen for keydown event on the document
document.addEventListener('keydown', function(event) {
    // Check if the left arrow key is pressed
    if (event.keyCode === 37) {
        prevImage(); // Call prevImage function
    }
    // Check if the right arrow key is pressed
    else if (event.keyCode === 39) {
        nextImage(); // Call nextImage function
    }
});

// Function to stop the extension and remove overlay and container
function stopExtension() {
    var overlay = document.getElementById('darkOverlay');
    var container = document.getElementById('imageContainer');
    var stopbtn = document.getElementById('stopButton');
    if (overlay) {
        overlay.remove(); // Remove overlay if exists
    }
    if (container) {
        container.remove(); // Remove container if exists
    }
    if (stopbtn) {
        stopbtn.remove(); // Remove stop button if exists
    }
}


// Function to create the darkened and blurred overlay with buttons
function createOverlay() {
    // Create overlay for darkened background
    var overlay = document.createElement('div');
    overlay.id = 'darkOverlay'; // Assign an ID for easier removal
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.90)'; // Dark background
    overlay.style.filter = 'blur(5px)'; // Blur effect
    overlay.style.zIndex = '9999';

    // Create container for image and navigation buttons
    var container = document.createElement('div');
    container.id = 'imageContainer';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.overflow = 'visible'; 
    container.style.zIndex = '10000'; // Ensure container appears above overlay

    // Append previous button
    var prevButton = document.createElement('button');
    prevButton.id = 'prevButton';
    prevButton.textContent = 'Previous';
    prevButton.style.padding = '10px 20px';
    prevButton.style.backgroundColor = '#333';
    prevButton.style.color = 'white';
    prevButton.style.border = 'none';
    prevButton.style.cursor = 'pointer';
    prevButton.style.marginRight = '10px';
    prevButton.style.position = 'absolute';
    prevButton.style.top = '50%';
    prevButton.style.left = '0';
    prevButton.style.transform = 'translateY(-50%)'; // Center vertically
    prevButton.style.zIndex = '10001'; // Ensure button appears above overlay and container
    prevButton.addEventListener('click', prevImage);
    container.appendChild(prevButton);

    // Append image display
    var imageDisplay = document.createElement('img');
    imageDisplay.id = 'imageDisplay';
    imageDisplay.style.maxWidth = '100%';
    imageDisplay.style.maxHeight = '100%';
    container.appendChild(imageDisplay);

    // Append next button
    var nextButton = document.createElement('button');
    nextButton.id = 'nextButton';
    nextButton.textContent = 'Next';
    nextButton.style.padding = '10px 20px';
    nextButton.style.backgroundColor = '#333';
    nextButton.style.color = 'white';
    nextButton.style.border = 'none';
    nextButton.style.cursor = 'pointer';
    nextButton.style.position = 'absolute';
    nextButton.style.top = '50%';
    nextButton.style.right = '0';
    nextButton.style.transform = 'translateY(-50%)'; // Center vertically
    nextButton.style.zIndex = '10001'; // Ensure button appears above overlay and container
    nextButton.addEventListener('click', nextImage);
    container.appendChild(nextButton);

    // Append stop extension button
    var stopButton = document.createElement('button');
    stopButton.id = 'stopButton';
    stopButton.textContent = 'STOP EXTENSION';
    stopButton.style.padding = '10px 20px';
    stopButton.style.backgroundColor = 'red';
    stopButton.style.color = 'white';
    stopButton.style.border = 'none';
    stopButton.style.cursor = 'pointer';
    stopButton.style.position = 'fixed';
    stopButton.style.bottom = '10px'; // Adjust bottom position as needed
    stopButton.style.left = '100px';
    stopButton.style.transform = 'translateX(-50%)'; // Center horizontally
    stopButton.style.zIndex = '10001'; // Ensure button appears above overlay and container
    stopButton.addEventListener('click', stopExtension);
    document.body.appendChild(stopButton); // Append to body

    // Start slideshow
    startSlideshow();

    // Append container to body
    document.body.appendChild(overlay);
    document.body.appendChild(container);
}
// Function to extract unique image URLs from the current page
function extractImages() {
    var images = document.querySelectorAll('img');
    imageUrls = [];
    images.forEach(function(image) {
        if (image.src && image.src !== '' && !imageUrls.includes(image.src)) {
            imageUrls.push(image.src);
        }
    });
    console.log("imageUrls=",imageUrls);
}




// Listen for messages from background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "extractImages") {
        console.log("Received request to extract images");
        extractImages();
        createOverlay(); // Create overlay
        displayImage(0); // Display first image
    } else if (message.action === "stopExtension") {
        console.log("Received stop extension message from background script");
        stopExtension();
    }
});
