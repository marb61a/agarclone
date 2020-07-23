// Where socketio stuff goes
const io = require('../servers').io;
const Orb = require('./classes/Orb');

// =========== Classes ==========
const Player = require('./classes/Player');
const PlayerData = require('./classes/PlayerData');
const PlayerConfig = require('./classes/PlayerConfig');
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
    socket.on('init', (data) => {
        // Make a PlayerConfig object
        let playerConfig = new PlayerConfig(settings);
        // Make a PlayerData object
        let playerData = new PlayerData(null, settings);
        // Make a master player object to hold both of the above
        let player = new Player(socket.id, playerConfig, playerData)
        socket.emit('init', {
            orbs
        });
    })
    
});

// Ran at the beginning of a new game
function initGame(){
    for(let i = 0; i < settings.defaultOrbs; i++){
        orbs.push(new Orb(settings));
    }
}

module.exports = io;