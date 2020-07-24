let socket = io.connect('http://localhost:8080');

// Called when user clicks on start button
function init(){
    draw();

    // Calls the init event when client is ready for data
    socket.emit('init', {
        playerName: player.namme
    });
}

socket.on('initReturn', (data) => {
    orbs = data.orbs

    setInterval(() => {
        socket.emit('tick', {
            xVector: player.xVector,
            yVector: player.yVector
        })
    }, 33)
});

socket.on('tock', (data) => {
    players = data.players
});
