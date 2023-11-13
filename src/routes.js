import express from 'express';

// Controllers
import UserController from './app/controllers/UserController.js';

const routes = express.Router();

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

export default routes;
