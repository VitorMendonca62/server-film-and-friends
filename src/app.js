// Modulos
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// Componentes
import routes from './routes.js';
import { startDatabase } from './database/index.js';

startDatabase();

// Iniciando express
const app = express();

// Aceitar json no body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use(routes);

// CORS
const corsOptions = {
  origin: process.env.CLIENT_HOST,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

// Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

export default app;
