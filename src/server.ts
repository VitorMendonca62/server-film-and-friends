import media from "./api/media"
// Libraries
import { config } from "dotenv";

// Components
import app from "./app";

// Take variables of environment
config();

// Config of server
const PORT = process.env.PORT || 4004;
const HOST = "localhost";

// Server listing
app.listen(PORT, () =>
  console.log(`[RUN] Server listing in http://${HOST}:${PORT}`),
);

media