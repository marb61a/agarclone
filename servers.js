const express = require('express');
const app = express();
app.use(
    express.static(__dirname + '/public')
);
const socketio = require('socket.io');
const expressServer = app.listen(8080);
const helmet = require('helmet');
app.use(helmet());
const io = socketio(expressServer);
app.use(helmet);

console.log("Express and socketio are listening on port 8080");