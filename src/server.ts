import { config } from "dotenv";
import app from "./app";
// import fetchAPIMedia from "./services/media/api_movies.js";

// Take variables of environment
config();

// Config of server
const PORT = process.env.PORT || 4004;
const HOST = "localhost";

// Server listing
app.listen(PORT, () =>
  console.log(`[RUN] Server listing in http://${HOST}:${PORT}`),
);
