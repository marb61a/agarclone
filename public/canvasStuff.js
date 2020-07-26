// =========== DRAWING ==========
function draw(){
    // Resets the translation back to the default
    context.setTransform(1, 0, 0, 1, 0, 0);

    // Clears the screen so that the previous frame is removed
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Clamps the camera to the player
    const camX = -player.locX + canvas.width / 2;
    const camY = -player.locY + canvas.height / 2;

    // Translate will allow for moving the canvas around
    context.translate(camX, camY);

    // Draw all players
    players.forEach((p) => {
        context.beginPath();
        context.fillStyle = p.color;

        // Creates an arc which can become a circle
        // Arg 1,2 are the x,y of the center of the circle
        // Arg 3 is the radius, Arg 4 is where on the circle to start
        // this is in radians, 0 radians is 3 O'Clock on the circle
        // Arg 5 is where to stop again in radians, PI * 2 is equal
        // to a full circle
        context.arc(p.locX, p.locY, 10, 0, Math.PI * 2);
        // context.arc(200, 200, 10, 0, Math.PI * 2);
        context.fill();

        // Set a border
        context.lineWidth = 3;
        context.strokeStyle = 'rgb(0,255,0)';
        context.stroke();
    })

    // Draw all orbs
    orbs.forEach((orb) => {
        context.beginPath();
        context.fillStyle = orb.color;
        context.arc(orb.locX, orb.locY, orb.radius, 0, Math.PI * 2);
        context.fill();
    });

    requestAnimationFrame(draw);

}

canvas.addEventListener('mousemove', (event) => {
    // console.log(event);

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

    player.xVector = xVector;
    player.yVector = yVector;

});
