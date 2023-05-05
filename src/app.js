const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('./firebase');

const routes = require('./routes');
app.use(routes);

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    // origin: 'https://client-film-and-friends.vercel.app',
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const { initSocket } = require('./socket');
initSocket(io);

module.exports = { server, app };
