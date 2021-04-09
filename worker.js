"use strict";

const R_OFFSET = 0;
const G_OFFSET = 1;
const B_OFFSET = 2;


let srcImageWidth = 0;
let srcImageHeight = 0;
let originalPixels = null;
let currentPixels = null;
let imgData = null;
let red = 0;
let green = 0;
let blue = 0;
let brightness = 0;
let contrast = 0;
let grayscale = false;


function getIndex(x, y){
    return (x + y * srcImageWidth) * 4;
}

function clamp(value) {
    return Math.max(0, Math.min(Math.floor(value), 255));
}

// Apply effects 

function addRed(x, y, value) {
    const index = getIndex(x, y) + R_OFFSET
    const currentValue = currentPixels[index];
    currentPixels[index] = clamp(currentValue + value);
}

function addGreen(x, y, value) {
    const index = getIndex(x, y) + G_OFFSET
    const currentValue = currentPixels[index];
    currentPixels[index] = clamp(currentValue + value);
}

function addBlue(x, y, value) {
    const index = getIndex(x, y) + B_OFFSET
    const currentValue = currentPixels[index]
    currentPixels[index] = clamp(currentValue + value)
}

function addBrightness(x, y, value) {
    addRed(x, y, value)
    addGreen(x, y, value)
    addBlue(x, y, value)
  }

function addContrast(x, y, value) {
    const redIndex = getIndex(x, y) + R_OFFSET
    const greenIndex = getIndex(x, y) + G_OFFSET
    const blueIndex = getIndex(x, y) + B_OFFSET
  
    const redValue = currentPixels[redIndex]
    const greenValue = currentPixels[greenIndex]
    const blueValue = currentPixels[blueIndex]
  
    const alpha = (value + 255) / 255 // Goes from 0 to 2, where 0 to 1 is less contrast and 1 to 2 is more contrast
  
    const nextRed = alpha * (redValue - 128) + 128
    const nextGreen = alpha * (greenValue - 128) + 128
    const nextBlue = alpha * (blueValue - 128) + 128
  
    currentPixels[redIndex] = clamp(nextRed)
    currentPixels[greenIndex] = clamp(nextGreen)
    currentPixels[blueIndex] = clamp(nextBlue)
  }

  function setGrayscale(x, y) {
    const redIndex = getIndex(x, y) + R_OFFSET
    const greenIndex = getIndex(x, y) + G_OFFSET
    const blueIndex = getIndex(x, y) + B_OFFSET
  
    const redValue = currentPixels[redIndex]
    const greenValue = currentPixels[greenIndex]
    const blueValue = currentPixels[blueIndex]
  
    const mean = (redValue + greenValue + blueValue) / 3
  
    currentPixels[redIndex] = clamp(mean)
    currentPixels[greenIndex] = clamp(mean)
    currentPixels[blueIndex] = clamp(mean)
  }

  function commitChanges() {
    for(let i = 0; i < imgData.data.length; i++){
        imgData.data[i] = currentPixels[i];
    }

    postMessage(imgData);
}




  function processImage() {
    currentPixels = originalPixels.slice();

    console.log(`red: ${red}`)
    console.log(`green: ${green}`)
    console.log(`blue: ${blue}`)

    for (let i = 0; i < srcImageHeight; i++) {
        for (let j = 0; j < srcImageWidth; j++) {
            
          if (grayscale) {
            setGrayscale(j, i)
          }
            addBrightness(j, i, brightness)
            addContrast(j, i, contrast)
            // addRed(j, i, red)
            // addGreen(j, i, green)
            // addBlue(j, i, blue)
          if (!grayscale) {
            addRed(j, i, red)
            addGreen(j, i, green)
            addBlue(j, i, blue)
          }
        }
      }
    
      commitChanges()

    commitChanges();
}

onmessage = function(event) {
    if(event.data[0] === "onload"){
        srcImageHeight = event.data[1];
        srcImageWidth = event.data[2];
        originalPixels = event.data[3];
        imgData = event.data[4];
      }else{
        red = event.data[0];
        green = event.data[1];
        blue = event.data[2];
        brightness = event.data[3];
        contrast = event.data[4];
        grayscale = event.data[5];
        processImage();
      }
}

