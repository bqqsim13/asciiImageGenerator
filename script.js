const imageUpload = document.getElementById('imageUpload'); // File input element for uploading images
const canvas = document.getElementById('canvas'); // Used for manipulating uploaded images
const ctx = canvas.getContext('2d'); // Rendering for 2D images
const asciiOutput = document.getElementById('asciiOutput'); // Div for displaying ASCII output
const resolutionInput = document.getElementById('resolution'); // Slider input for adjusting ASCII resolution
const resolutionValue = document.getElementById('resolutionValue'); // Span for showing the current resolution value

let resolution = parseInt(resolutionInput.value); // Default resolution value (8)

// Event listener for updating resolution value when slider is moved
resolutionInput.addEventListener('input', (event) => {
    resolution = parseInt(event.target.value); // Update resolution value dynamically
    resolutionValue.textContent = resolution; // Update resolution value in the UI

    // Reconvert the image to ASCII art with the new resolution
    if (canvas.width > 0 && canvas.height > 0) { // Ensure an image is already uploaded
        const ascii = convertToAscii(); // Call the conversion function with updated resolution
        asciiOutput.innerText = ascii; // Update the ASCII output
    }
});

// Handling uploaded files
imageUpload.addEventListener('change', (event) => {
    // Grab the first file in the fileList (typically the only one)
    const file = event.target.files[0];
    // Read uploaded files
    const reader = new FileReader();
    // When file is read successfully, this should run
    reader.onload = (e) => {
        // Create an image element in memory
        const img = new Image();
        // Upload image into memory using the data URL
        img.src = e.target.result;

        // Ensures image is ready to be processed (very important!)
        img.onload = () => {
            // Resize canvas (where ASCII conversion will happen) to match the uploaded image dimensions
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the uploaded image starting from the top-left corner (origin in JS is top-left)
            ctx.drawImage(img, 0, 0);

            // Call the ASCII conversion function
            const ascii = convertToAscii();

            // Dynamically adjust the size of the ASCII output box to match the uploaded image dimensions
            asciiOutput.style.width = `${img.width}px`;
            asciiOutput.style.height = `${img.height}px`;
            asciiOutput.style.maxWidth = '100%'; // Prevent the box from exceeding the viewport width
            asciiOutput.style.overflowY = 'auto'; // Add a scrollbar if needed for large content

            // Display the ASCII art in the output div
            asciiOutput.innerText = ascii;
        };
    };
    // Read the file as a Data URL (important to define onload first!)
    if (file) reader.readAsDataURL(file);
});

// ASCII conversion function (converts canvas pixels into ASCII characters)
function convertToAscii() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Get pixel data from the canvas
    const data = imageData.data; // Flat array of RGBA values
    const width = imageData.width; // Image width
    const height = imageData.height; // Image height

    const asciiChars = "@%#*+=-:. "; // ASCII gradient from dark to light
    const asciiArray = []; // Array to store ASCII rows

    for (let y = 0; y < height; y += resolution) { // Loop over rows with step size based on resolution
        let row = ''; // Initialize a new row of ASCII characters
        for (let x = 0; x < width; x += resolution) { // Loop over columns with step size based on resolution
            const index = (y * width + x) * 4; // Index of the current pixel in the flat RGBA array
            const r = data[index]; // Red value
            const g = data[index + 1]; // Green value
            const b = data[index + 2]; // Blue value

            // Calculate grayscale intensity (simple average method)
            const gray = (r + g + b) / 3;

            // Map grayscale intensity to an ASCII character
            const char = asciiChars[Math.floor((gray / 255) * (asciiChars.length - 1))];
            row += char; // Append the ASCII character to the current row
        }
        asciiArray.push(row); // Add the completed row to the array
    }

    // Join all rows with newline characters to form the complete ASCII art
    return asciiArray.join('\n');
}


const imgPreview = document.createElement('img');
imgPreview.src = img.src;
document.body.appendChild(imgPreview);

canvas.width = Math.min(img.width, 800);
canvas.height = Math.min(img.height, 800);

asciiOutput.style.fontSize = `${Math.max(10, resolution * 1.5)}px`;



