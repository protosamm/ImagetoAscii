let img; // image variable
let imageLoaded = false
// brightness values
const density = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`. ';

// preload function to let the system know we are going to load an image
function preload(){
  img = loadImage("dog_of.jpeg");
}

// This is where we initialize our values
function setup() {
  const canvas = createCanvas(600, 600); // Example canvas size
  canvas.parent('canvas-container');
  pixelDensity(1); // showing only one pixel per pixel
  img.loadPixels(); // loading pixel array of image
  imgDen = 20; // for large image dimension increase this
  noLoop(); // stop draw from looping
  
  // Add event listeners for buttons
  document.getElementById('custom-upload-button').addEventListener('click', () => {
    document.getElementById('image-upload').click(); // Trigger the file input click
  });
  document.getElementById('image-upload').addEventListener('change', handleFileUpload);

  generateAsciiArt(); // call function to generate ASCII art once
}

// Function to generate and display ASCII art
function generateAsciiArt() {
  background(0); // background black

  hr = height / img.height; // Canvas to image height ratio
  wr = width / img.width; // Canvas to image width ratio

  // Iterate though pixels of image with stepsize as imgDen.
  // For big images skipping pixels is better for performance.
  for (let x = 0; x < img.width; x += imgDen) {
    for (let y = 0; y < img.height; y += imgDen) {
      let c = img.get(x, y);
      let brLevel = (c[0] + c[1] + c[2]) / 3; // Calculates average of red, green and blue value to get the brightness value of each pixel
      fill(255); // make every character 100% visible and white
      const len = density.length;
      const charIndex = floor(map(brLevel, 0, 255, len, 0)); // mapping characters of density string to brightness value
      textSize(imgDen * wr);
      textAlign(CENTER, CENTER);
      text(density.charAt(charIndex), x * wr, y * hr);
    }
  }

  updatePixels();  
}

// Function to handle image file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    img = loadImage(URL.createObjectURL(file), () => {
      document.getElementById('sample-image').src = URL.createObjectURL(file);
      img.loadPixels(); // Load pixel array of the new image
      imgLoaded = true;
      generateAsciiArt(); // Generate ASCII art after image is loaded
    });
  } else {
    console.log('Not an image file.');
  }
}
  // Slider setup
  const slider = document.getElementById('density-slider');
  const sliderValue = document.getElementById('density-value');
  slider.addEventListener('input', () => {
      imgDen = parseInt(slider.value, 10);
      sliderValue.textContent = imgDen;
      generateAsciiArt(); // Regenerate ASCII art when slider changes
  });

function draw() {
  // Draw function is now empty and will not loop, as we only need to draw once.
}
