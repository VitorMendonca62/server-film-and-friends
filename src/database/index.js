const { Sequelize } = require('sequelize');
const configDataBase = require('../config/database');

const connection = new Sequelize(configDataBase);

try {
  connection.authenticate();
  console.log('[DATABASE] Database connected successfully');
} catch (err) {
  console.log('[DATABASE] Database connection was interrupted:', err);
}

// MODELS
const User = require('../app/models/User');

const models = [User];

models.forEach((model) => model.init(connection));

module.exports = connection;
