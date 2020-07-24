// Where socketio stuff goes
const io = require('../servers').io;
const Orb = require('./classes/Orb');

// =========== Classes ==========
const Player = require('./classes/Player');
const PlayerData = require('./classes/PlayerData');
const PlayerConfig = require('./classes/PlayerConfig');
const Orb = require('./classes/Orb');

let orbs =[];
let players = [];
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

// Issue a message to every connected socket to run at 30FPS
setInterval(() => {
    io.to('.game').emit('tock', {
        players
    });
}, 33);

io.sockets.on('connect', (socket) => {
    // A player has connected
    socket.on('init', (data) => {
        // Add the playe to the game namespace
        socket.join('game');

        // Make a PlayerConfig object
        let playerConfig = new PlayerConfig(settings);
        // Make a PlayerData object
        let playerData = new PlayerData(data.playerName, settings);
        // Make a master player object to hold both of the above
        let player = new Player(socket.id, playerConfig, playerData)
        socket.emit('initReturn', {
            orbs
        });

        players.push(playerData);
    })
    
});

// Ran at the beginning of a new game
function initGame(){
    for(let i = 0; i < settings.defaultOrbs; i++){
        orbs.push(new Orb(settings));
    }
}

module.exports = io;