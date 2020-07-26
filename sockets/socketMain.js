// Where socketio stuff goes
const io = require('../servers').io;
const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions;
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions;

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
        players,
    });
}, 33);

io.sockets.on('connect', (socket) => {
    let player = {};

    // A player has connected
    socket.on('init', (data) => {
        // Add the playe to the game namespace
        socket.join('game');

        // Make a PlayerConfig object
        let playerConfig = new PlayerConfig(settings);
        // Make a PlayerData object
        let playerData = new PlayerData(data.playerName, settings);
        // Make a master player object to hold both of the above
        player = new Player(socket.id, playerConfig, playerData);

        // Issue a message to this 
        setInterval(() => {
            io.to('.game').emit('tickTock', {
                playerX: player.playerData.locX,
                playerY: player.playerData.locY
            });
        }, 33);

        socket.emit('initReturn', {
            orbs
        });

        players.push(playerData);
    });
    
    // Server has sent over a tick so the direction to move player is now known
    socket.on('tick', (data) => {
        speed = player.playerConfig.speed;

        // Updates the playerConfig object with the new direction in data
        // Simultaneously create a local variable for this callback to improve readability
        xV = player.PlayerConfig.xVector = data.xVector;
        yV = player.PlayerConfig.yVector = data.yVector;
    
        if((player.playerData.locX < 5 && player.playerData.xVector < 0) || (player.playerData.locX > 500) && (xV > 0)){
            player.playerData.locY -= speed * yV;
        }else if((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > 500) && (yV < 0)){
            player.playerData.locX += speed * xV;
        }else{
            player.playerData.locX += speed * xV;
            player.playerData.locY -= speed * yV;
        } 
    })
});

// Orb collision
let capturedOrb = checkForOrbCollisions(player.playerData,player.playerConfig,orbs,settings);
capturedOrb.then((data) => {
    // The then will run if resolve runs
    // Emits to all sockets the orb to replace
    const orbData = {
        orbIndex: data,
        newOrb: orbs[data]
    };

    // Every socket needs to know that the leaderboard has changed

});

// Ran at the beginning of a new game
function initGame(){
    for(let i = 0; i < settings.defaultOrbs; i++){
        orbs.push(new Orb(settings));
    }
}

module.exports = io;