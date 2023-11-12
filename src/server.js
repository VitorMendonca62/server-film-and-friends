/* eslint-disable no-console */
import { config } from 'dotenv';
import app from './app.js';

// Conseguir pegar variaveis de ambiete
config();

// Config of server
const PORT = process.env.PORT || 4004;
const HOST = process.env.HOST || 'localhost';

// Server listing
app.listen(PORT, () => console.log(`[RUN] Server listing in http://${HOST}:${PORT}`));
