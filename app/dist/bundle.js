(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
/* global window, document, io */

var socket = io.connect('http://localhost:8080');

var p1_direction = 0;
var p1_direction_speed = 0;

var hasBall = false;

window.addEventListener('deviceorientation', function (orientation) {
  var alpha = orientation.alpha;
  var beta = orientation.beta;
  var gamma = orientation.gamma;

  beta = Math.round(beta);

  p1_direction_speed = Math.abs(beta) / 25;
  if (beta > 5) {
    p1_direction = 1;
  } else if (beta < -5) {
    p1_direction = -1;
  } else {
    p1_direction = 0;
    p1_direction_speed = 0;
  }
}, true);

// ------------------
// -- handle input --
// ------------------

var canvasElement = document.querySelector('canvas');

canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;

var game = {
  ctx: canvasElement.getContext('2d'),
  width: canvasElement.width,
  height: canvasElement.height
};

var paddle = {
  width: canvasElement.width / 50,
  height: canvasElement.height / 5,
  speed: canvasElement.height / 50
};

var ball = {
  x: 50,
  y: 50,
  radius: canvasElement.width / 50,
  speedX: canvasElement.width / 100,
  speedY: canvasElement.width / 500,
  color: '#E3EB64'
};

// players
var p1 = {
  x: 10,
  y: game.height / 2 - paddle.height / 2,
  color: "#A7EBCA"
};

socket.on('ball', function (_b) {
  console.log('back ball', _b);
  ball = _b;
  hasBall = true;
});

// reset ball
var new_ball = function new_ball() {

  // position
  ball.x = game.width - 100;
  ball.y = game.height / 2;

  // speed
  var rand = Math.random() * 6 + 4;
  ball.speedX = Math.random() > 0.5 ? rand : -rand;
  ball.speedY = Math.random() > 0.5 ? rand : -rand;
};

new_ball();
socket.on('player1', function () {
  new_ball();
  hasBall = true;
});

// draw everything
function draw(time) {
  // getGamepadInput();
  clear(game.ctx, game.width, game.height);

  p1.y += p1_direction * paddle.speed * time * p1_direction_speed;
  drawRectangle(game.ctx, p1.x, p1.y, paddle.width, paddle.height, p1.color);

  if (hasBall) {

    ball.x += ball.speedX * time;
    ball.y += ball.speedY * time;

    if (ball.y + ball.radius >= p1.y && ball.y - ball.radius <= p1.y + paddle.height && ball.x - ball.radius <= p1.x + paddle.width) {
      ball.speedX = -ball.speedX;
      ball.speedX *= 1.1;
    }

    if (p1.y <= 0) {
      p1.y = 0;
    }

    if (p1.y + paddle.height >= canvasElement.height) {
      p1.y = canvasElement.height - paddle.height;
    }

    if (ball.y - ball.radius <= 0) {
      ball.speedY = -ball.speedY;
    }

    if (ball.y + ball.radius >= canvasElement.height) {
      ball.speedY = -ball.speedY;
    }

    if (ball.x - ball.radius <= 0) {
      new_ball();
    }

    if (ball.x + ball.radius >= canvasElement.width) {
      // new_ball();
      hasBall = false;
      socket.emit('ball', ball);
      console.log('emit', ball);
    }

    drawCircle(game.ctx, ball.x, ball.y, ball.radius);
  }
}

var lastFrameTime = Date.now();
var onAnimationFrame = function onAnimationFrame() {
  var thisFrameTime = Date.now();
  draw((thisFrameTime - lastFrameTime) / 30);
  lastFrameTime = thisFrameTime;
  window.requestAnimationFrame(onAnimationFrame);
};

onAnimationFrame();

// socket.on('news', function (data) {
//   console.log(data);
//   socket.emit('my other event', { my: 'data' });
// });

// ------------------------------
// -- canvas drawing functions --
// ------------------------------

function drawRectangle(ctx, x, y, width, height, color) {
  ctx.fillStyle = color ? color : "white";
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.closePath();
  ctx.fill();
}

function drawCircle(ctx, x, y, radius, color) {
  ctx.fillStyle = color ? color : "white";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

function drawText(ctx, x, y, txt, font, color) {
  ctx.fillStyle = color ? color : "white";
  ctx.font = font ? font : "bold 18px sans-serif";
  ctx.fillText(txt, x, y);
}

function clear(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

},{}]},{},[1]);
