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
    console.log(event);

    const mousePosition = {
        x: event.clientX,
        y: event.clientY
    };

    const angleDeg = Math.atan2(mousePosition.y - (canvas.height/2), mousePosition.x - (canvas.width/2)) * 180 / Math.PI;
    if(angleDeg >= 0 && angleDeg < 90){
        xVector = 1 - (angleDeg/90);
        yVector = -(angleDeg/90);
    }else if(angleDeg >= 90 && angleDeg <= 180){
        xVector = -(angleDeg-90)/90;
        yVector = -(1 - ((angleDeg-90)/90));
    }else if(angleDeg >= -180 && angleDeg < -90){
        xVector = (angleDeg+90)/90;
        yVector = (1 + ((angleDeg+90)/90));
    }else if(angleDeg < 0 && angleDeg >= -90){
        xVector = (angleDeg+90)/90;
        yVector = (1 - ((angleDeg+90)/90));
    }

    speed = 10;
    xV = xVector;
    yV = yVector;

    if((player.locX < 5 && player.xVector < 0) || (player.locX > 500) && (xV > 0)){
        player.locY -= speed * yV;
    }else if((player.locY < 5 && yV > 0) || (player.locY > 500) && (yV < 0)){
        player.locX += speed * xV;
    }else{
        player.locX += speed * xV;
        player.locY -= speed * yV;
    } 
});
