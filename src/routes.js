import express from 'express';

// Middlewares
import auth from './app/middlewares/auth.js';

// Controllers
import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';

const routes = express.Router();

routes.post('/users', UserController.store);
routes.post('/auth/login', SessionController.store);
routes.get('/users', UserController.index);

routes.use(auth);
routes.get('/users/find', UserController.show);
routes.delete('/users/:id', UserController.delete);
routes.patch('/users/:id', UserController.update);
routes.patch('/users/password/:id', UserController.updatePassword);

export default routes;
