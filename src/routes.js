const express = require('express');
const routes = express.Router();

const authMiddleware = require('./app/middlewares/auth');

// Controllers
const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');

// User registration and login
routes.post('/auth/login', SessionController.store);
routes.post('/auth/users', UserController.store);
routes.get('/auth/users/:id', UserController.show);

routes.get('/auth/users', UserController.index);
// Middlewares
routes.use(authMiddleware);

// User API

routes.get('/auth/users/username/:username', UserController.showForUsername);
routes.delete('/auth/users/:id', UserController.delete);
routes.patch('/auth/users/:id', UserController.update);

module.exports = routes;
