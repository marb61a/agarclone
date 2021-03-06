// Where socketio stuff goes
const io = require('../servers').io;
const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions;
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions;

// =========== Classes ==========
const Player = require('./classes/Player');
const PlayerData = require('./classes/PlayerData');
const PlayerConfig = require('./classes/PlayerConfig');
const Orb = require('./classes/Orb');

let orbs = [];
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
    if(players.length > 0){
        io.to('.game').emit('tock', {
            players,
        });
    }
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
            socket.emit('tickTock', {
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
    
        if((player.playerData.locX < 5 && player.playerData.xVector < 0) || (player.playerData.locX > settings.worldWidth) && (xV > 0)){
            player.playerData.locY -= speed * yV;
        }else if((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight) && (yV < 0)){
            player.playerData.locX += speed * xV;
        }else{
            player.playerData.locX += speed * xV;
            player.playerData.locY -= speed * yV;
        }

        // Orb collision
        let capturedOrb = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings);
        capturedOrb.then((data) => {
            // The then will run if resolve runs which means a collision happened
            // Emits to all sockets the orb to replace
            const orbData = {
                orbIndex: data,
                newOrb: orbs[data]
            };

            // console.log(orbData);

            // Every socket needs to know that the leaderboard has changed
            io.sockets.emit('updateLeaderBoard', getLeaderBoard());
            io.sockets.emit('orbSwitch', orbData);
        })
        .catch(() => {
            // The catch will run if reject runs which means no collision
            // console.log("No collision!")
        });

        // Player Collision
        let playerDeath = checkForPlayerCollisions(player.playerData, player.playerConfig, players, player.socketId)
        playerDeath.then((data) => {
            // console.log('Player collision');
            // Every socket needs to know that the leaderboard has changed
            io.sockets.emit('updateLeaderBoard',getLeaderBoard());

            // Tells everone that a player has been absorbed
            io.sockets.emit('playerDeath', data);
        })
        .catch(() => {
            // This catch runs if the reject runs as there is no collision
            // console.log('No Player Collision');
        })
    });

    socket.on('disconnect', (data) => {
        // console.log(data);
        // Finds out which player in players has left and makes sure player exists
        if(player.playerData){
            players.forEach((currPlayer, i) => {
                // If the players match
                if(currPlayer.uid == player.playerData.uid){
                    players.splice(i, 1);
                    io.sockets.emit('updateLeaderBoard', getLeaderBoard());
                }
            });

            // If a db connection is set up
            // const updateStats = `
            // UPDATE stats
            //     SET highScore = CASE WHEN highScore < ? THEN ? ELSE highScore END,
            //     mostOrbs = CASE WHEN mostOrbs < ? THEN ? ELSE mostOrbs END,
            //     mostPlayers = CASE WHEN mostPlayers < ? THEN ? ELSE mostPlayers END
            // WHERE username = ?
            // `;
        }
    });
});

function getLeaderBoard(){
    // Sort players in descending order
    players.sort((a, b) => {
        return b.score - a.score;
    });

    let leaderBoard = players.map((curPlayer) => {
        return {
            name: curPlayer.name,
            score: curPlayer.score
        }
    });

    return leaderBoard;
}

// Ran at the beginning of a new game
function initGame(){
    for(let i = 0; i < settings.defaultOrbs; i++){
        orbs.push(new Orb(settings));
    }
}

module.exports = io;