let wHeight = $(window).height();
let wWidth = $(window).width();

let canvas = document.querySelector('#the-canvas');
// Can be set to either 2d or Webgl\2
let context = canvas.getContext('2d');
canvas.width = wWidth;
canvas.height = wHeight;
