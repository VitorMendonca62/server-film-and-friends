const { server } = require('./app.js');
const PORT = 4004;

const listener = server.listen(PORT, (e) => {
  console.log(listener.address().address)
  console.log(`[SERVER] => Server listing on http://localhost:${PORT}`)
}
);
