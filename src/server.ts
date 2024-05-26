// Libraries
import { config } from "dotenv";

// Components
import { app, server } from "./app";

// Take variables of environment
config();

// Config of server
const PORT = process.env.PORT || 4004;
const HOST = "localhost";

// Server listing

server.listen(4004, () => {
  console.log(`[RUN] Socket is active!`);
});

app.listen(PORT, () =>
  console.log(`[RUN] Server listing in http://${HOST}:${PORT}`),
);
