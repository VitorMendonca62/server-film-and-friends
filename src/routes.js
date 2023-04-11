const express = require('express');
const routes = express.Router();

// Controllers
const UserController = require('./app/controllers/UserController');

routes.post('/auth/users', UserController.store);
routes.get('/auth/users', UserController.index);
routes.get('/auth/users/:id', UserController.show);
routes.delete('/auth/users/:id', UserController.delete);
routes.patch('/auth/users/:id', UserController.update);

module.exports = routes;
