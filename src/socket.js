const users = [];
const messages = [];
let stateVideo = {};

function initSocket(io) {
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
}

module.exports = { initSocket };
