let socket = io.connect('http://localhost:8080');

function init(){
    draw();

    socket.emit('init', {
        playerName: player.namme
    });
}

socket.on('init', (data) => {
    orbs = data.orbs
});
