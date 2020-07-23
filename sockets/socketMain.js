// Where socketio stuff goes
const io = require('../servers').io;
const Orb = require('./classes/Orb');

let orbs =[];
let settings = {
    defaultOrbs: 500,
    defaultSpeed: 6,
    defaultSize: 6,
    // As a player grows larger the zoom should go out
    defaultZoom: 1.5,
    worldWidth: 500,
    worldHeight: 500
};

initGame();

io.sockets.on('connect', (socket) => {
    // A player has connected
    // Make a PlayerConfig object
    // let playerConfig = new playerConfig();
    // Make a PlayerData object
    // let playerData = new playerData();
    // Make a master player object to hold both of the above
    // let Player = new Player(socket.id, playerConfig, playerData)
    socket.emit('init', {
        orbs
    });
});

// Ran at the beginning of a new game
function initGame(){
    for(let i = 0; i < settings.defaultOrbs; i++){
        orbs.push(new Orb(settings));
    }
}

module.exports = io;