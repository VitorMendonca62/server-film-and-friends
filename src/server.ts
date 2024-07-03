// Libraries
import { config } from "dotenv";

// Components
import { app, server } from "./app";

// Take variables of environment
config();

// Config of server
const PORT = process.env.PORT || 4004;
const HOST = "localhost";

// Socket active
server.listen(4004, () => {
  console.log(`[RUN] Socket is active!`);
});

// Server listing in port
app.listen(PORT, () =>
  console.log(`[RUN] Server listing in http://${HOST}:${PORT}`),
);
