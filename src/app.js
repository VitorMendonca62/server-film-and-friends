const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://127.0.0.1:5173',
    methods: ['GET', 'POST'],
  },
});

const users = [];
const messages = [];
let stateVideo = {};



io.on('connection', (socket) => {
  console.log(`[SOCKET] => A user connected: ${socket.id}`);
  socket.on('select-name', (data) => {
    users.push(data);
  });

  socket.on('sendMessage', (data) => {
    messages.push(data);
    io.emit('receivedMessage', data);
  });

  socket.on('stateVideo', (data) => {
    stateVideo = { isPaused: data.isPaused };
    console.log(data);
    io.emit('receivedStateVideo', data);
  });
});

module.exports = { server };
