function init(){
    draw();
}

// =========== DRAWING ==========
let randomX = Math.floor(500 * Math.random() + 10);
let randomY = Math.floor(500 * Math.random() + 10);

function draw(){
    context.beginPath();
    context.fillStyle = 'rgb(255,0,0)';

    // Creates an arc which can become a circle
    // Arg 1,2 are the x,y of the center of the circle
    // Arg 3 is the radius, Arg 4 is where on the circle to start
    // this is in radians, 0 radians is 3 O'Clock on the circle
    // Arg 5 is where to stop again in radians, PI * 2 is equal
    // to a full circle
    context.arc(randomX, randomY, 10, 0, Math.PI * 2);
    context.fill();

    // Set a border
    context.lineWidth = 3;
    context.strokeStyle = 'rgb(0,255,0)';
    context.stroke();
    requestAnimationFrame(draw);

}

canvas.addEventListener('mousemove', (event) => {

});
