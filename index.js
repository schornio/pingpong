'use strict';

const PORT = process.env.PORT || 8080;

const express = require('express');
const socketIO = require('socket.io');

let app = express();
let server = require('http').Server(app);
let io = socketIO(server);

app.use(express.static(`${__dirname}/app/dist`));

const changeBall = (otherPlayer) => {
  return (ball) => {
    ball.x -= 10;
    ball.y -= 10;
    ball.speedX *= -1;
    console.log(ball);
    otherPlayer.emit('ball', ball);
  };
};

let player2 = null;
io.on('connection', function (socket) {
  if (player2) {
    socket.emit('player1');
    player2.emit('player2');

    socket.on('ball', changeBall(player2));
    player2.on('ball', changeBall(socket));

    player2 = null;
    console.log('Player 2 connected');
  } else {
    player2 = socket;
    console.log('Player 1 connected');
  }
});


server.listen(PORT, () => console.log(`Server listening on port ${PORT} ...`));
