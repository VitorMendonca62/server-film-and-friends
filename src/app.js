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

const cors = require('cors');
app.use(cors());

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

const livekitApi = require('livekit-server-sdk');
const { AccessToken, RoomServiceClient } = livekitApi;

const API_KEY = 'APIVKGDTnWrocvt';
const SECRET_KEY = 'ugdFVAvWGrDmp0rfex1fvp4KVNBuFqJgrqG9lW1G77vB';

const roomName = 'filme';

app.get('/token/:username', (req, res) => {
  const participandName = req.params.username;
  const at = new AccessToken(API_KEY, SECRET_KEY, {
    identity: participandName,
  });
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: false,
    canSubscribe: true,
  });
  const token = at.toJwt();

  return res.json({ token });
});

module.exports = { server, app };
