const imageUpload = document.getElementById('imageUpload');
const canvas = document.getElementById('canvas'); //used for manipulating uploaded images
const ctx = canvas.getContext('2d'); //rendering for 2D images
const asciiOutput = document.getElementById('asciiOutput');

//handling uploaded files:
imageUpload.addEventListener('change', (event) => {
    //grab the first file in the fileList, basically the only one
    const file = event.target.files[0];
    //read uploaded files
    const reader = new FileReader();
    //when file is read successfully, this should run
    reader.onload = (e) => {
        //create image element for the memory
        const img = new Image();
        //upload image into memory
        img.src = e.target.result;

        //ensures image is ready to be run (IMP!!!)
        img.onload = () => {
            //resize canvas (where ascii will be done) to same size as the uploaded image
            canvas.width = img.width;
            canvas.height = img.height;

            //draws the uploaded image starting from top left corner (origin in JS is at top left of items)
            ctx.drawImage(img, 0, 0);

            //move to ascii function once canva drawn
            const ascii = convertToAscii();

            //change da box size based on uploaded image
            asciiOutput.style.width = `${img.width}px`; 
            asciiOutput.style.height = `${img.height}px`; 
            asciiOutput.style.maxWidth = '100%'; 
            asciiOutput.style.overflowY = 'auto'; 

            asciiOutput.innerText = ascii;
        };
    };
    //readonload needs to be defined for the file to actually be read
    if (file) reader.readAsDataURL(file);
});

function convertToAscii() {
    //retrive rgba data from the canva and its h/w
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //extract only the rgba data (an array containing all pixel values)
    const data = imageData.data;
    //we need height and width data also
    const width = imageData.width;
    const height = imageData.height;

    //asciiCharacters
    const asciiChars = "@%#*+=-:. "; 
    //output ascii
    const asciiArray = [];

    //reducing resolution (ascii don't need hi-def)
    //8 is the standard skip value for ascii resolution, 
    for (let y = 0; y < height; y += 4) { 
        //string for ascii characters
        let row = '';
        //looping through every 8th column of the x (down the width)
        for (let x = 0; x < width; x += 4) {
            //each pixel is represented by 4 values (rgba), renmber multiply 4
            const index = (y * width + x) * 4;
            //contain rgb values
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            //make image grayVersion (ez)
            //i think take the rgb values and get average for grayscale intensity (how dark)
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            const normalized = gray/255

            //hmmm
            const char = asciiChars[Math.floor((normalized) * (asciiChars.length - 1))];
            row += char;
        }
        asciiArray.push(row);
    }

    return asciiArray.join('\n');
}

const imgPreview = document.createElement('img');
imgPreview.src = img.src;
document.body.appendChild(imgPreview);

canvas.width = Math.min(img.width, 800);
canvas.height = Math.min(img.height, 800);


