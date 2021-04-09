"use strict"

function spin() {
    const spinner = document.getElementById("spinner");
    let angle = 0;
    setInterval(() => {
        angle++;
        spinner.style.transform = `rotate(${angle}deg)`;
    },20)
}

spin();

//Image Processing
const fileInput = document.getElementById("fileinput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const srcImage = new Image;
const red = document.getElementById('red');
const brightness = document.getElementById('brightness');
const grayscale = document.getElementById('grayscale');
const contrast = document.getElementById('contrast');

let imgData =  null;
let originalPixels = null;
let currentPixels = null;


fileinput.onchange = function (e) {
    if (e.target.files && e.target.files.item(0)) {
      srcImage.src = URL.createObjectURL(e.target.files[0]);
    }
  }

  srcImage.onload = function () {
    canvas.width = srcImage.width;
    canvas.height = srcImage.height;
    ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height);
    imgData = ctx.getImageData(0, 0, srcImage.width, srcImage.height);
    originalPixels = imgData.data.slice();
  
    imgWorker.postMessage(["onload", srcImage.height, srcImage.width, originalPixels, imgData]);
  }

const imgWorker = new Worker("worker.js");

//Sending Data
function processImage(){
    imgWorker.postMessage([Number(red.value), Number(green.value), Number(blue.value), Number(brightness.value), Number(contrast.value), Boolean(grayscale.checked)]);
}

//Receiving Data
imgWorker.onmessage = function(event){
    imgData = event.data;
  
    ctx.putImageData(imgData, 0, 0, 0, 0, srcImage.width, srcImage.height);
  }

red.onchange = processImage;
green.onchange = processImage;
blue.onchange = processImage;
brightness.onchange = processImage;
grayscale.onchange = processImage;
contrast.onchange = processImage;