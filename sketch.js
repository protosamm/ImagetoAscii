let img;
let imageLoaded = false;
let imgDen = 20;

const textContainer = document.getElementById('text-container');
const density = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`. ';

// Preload default image
function preload() {
  img = loadImage("dog_of.jpeg", () => {
    img.loadPixels();
    generateAsciiArt();
  });
}

function setup() {
  noCanvas();
  pixelDensity(1);

  // Upload button
  document.getElementById('custom-upload-button').addEventListener('click', () => {
    document.getElementById('image-upload').click();
  });
  document.getElementById('image-upload').addEventListener('change', handleFileUpload);

  // Slider + number input
  const slider = document.getElementById('density-slider');
  const sliderInput = document.getElementById('density-input');
  const sliderValue = document.getElementById('density-value');

  slider.addEventListener('input', () => {
    imgDen = parseInt(slider.value, 10);
    sliderInput.value = imgDen;
    sliderValue.textContent = imgDen;
    generateAsciiArt();
  });

  sliderInput.addEventListener('input', () => {
    let val = parseInt(sliderInput.value, 10);
    if (isNaN(val)) return;
    val = Math.max(2, Math.min(50, val));
    imgDen = val;
    slider.value = imgDen;
    sliderValue.textContent = imgDen;
    generateAsciiArt();
  });
}

// Generate ASCII
function generateAsciiArt() {
  if (!img) return;
  img.loadPixels();
  const w = img.width;
  const h = img.height;
  
  // precompute brightness -> char mapping
  const brightnessToChar = new Array(256);
  for (let i = 0; i < 256; i++) {
    brightnessToChar[i] = density.charAt(Math.floor(map(i, 0, 255, density.length, 0)));
  }

  let asciiArt = "";

  for (let y = 0; y < h; y += imgDen) {
    let row = "";
    for (let x = 0; x < w; x += imgDen) {
      const idx = 4 * (y * w + x);
      const r = img.pixels[idx];
      const g = img.pixels[idx + 1];
      const b = img.pixels[idx + 2];

      const brightness = (r + g + b) / 3;
      row += brightnessToChar[Math.floor(brightness)] + " ";
    }
    asciiArt += row + "\n";
  }

  textContainer.textContent = asciiArt;
  console.clear();
  console.log(asciiArt);
}


// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    img = loadImage(URL.createObjectURL(file), () => {
      document.getElementById('sample-image').src = URL.createObjectURL(file);
      img.loadPixels();
      generateAsciiArt();
    });
  } else {
    console.log('Not an image file.');
  }
}

function draw() {
  // empty
}

document.getElementById('copy-button').addEventListener('click', () => {
  const asciiText = textContainer.textContent;
  if (!asciiText) return;

  navigator.clipboard.writeText(asciiText)
    .then(() => {
      alert("ASCII art copied to clipboard!");
    })
    .catch(err => {
      console.error("Failed to copy ASCII art:", err);
    });
});

