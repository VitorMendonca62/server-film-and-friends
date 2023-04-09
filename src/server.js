const { server, app } = require('./app.js');
const PORT_SOCKET = 4004;
const PORT_SERVER = 4003;

server.listen(PORT_SOCKET, (e) =>
  console.log(
    `[SERVER-SOCKET] => Server listing on http://localhost:${PORT_SOCKET}`
  )
);
app.listen(PORT_SERVER, (e) =>
  console.log(`[SERVER] => Server listing on http://localhost:${PORT_SERVER}`)
);
