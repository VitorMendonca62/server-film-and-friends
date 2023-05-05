const users = [];
const messages = [];

function initSocket(io) {
  io.on('connection', (socket) => {
    console.log(`[SOCKET] => A user connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[SOCKET] => A user disconnected: ${socket.id}`);
    });

    socket.on('join-room', (roomiD, userId, username) => {
      socket.join('roomiD');

      console.log('ENTROU NA SALA'); // VEM 2 VEZES
      socket.on('send-message', (message) => {
        console.log('MANDOU'); // VEM 2 VEZES

        io.emit('received-message', message, username);
      });
    });
  });
}

module.exports = { initSocket };
