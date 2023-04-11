const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    // origin: 'https://client-film-and-friends.vercel.app',
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const users = [];
const messages = [];
let stateVideo = {};

io.on('connection', (socket) => {
  console.log(`[SOCKET] => A user connected: ${socket.id}`);
  socket.on('disconnect', (reason) => {
    console.log(`[SOCKET] => A user disconnected: ${socket.id}`);
  });

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

require('./database');
const cors = require('cors');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const routes = require('./routes');

app.use(routes);

module.exports = { server, app };
