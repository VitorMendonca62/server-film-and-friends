/* eslint-disable import/no-extraneous-dependencies */
import { Sequelize } from 'sequelize';
import configDatabase from '../config/database.js';

// Models
import User from '../app/models/User.js';

// Conexão
export const connection = new Sequelize(configDatabase);

export function startDatabase() {
  try {
    connection.authenticate();
    console.log('[DATABASE] Database connected successfully');
  } catch (err) {
    console.log('[DATABASE] Database connection was interrupted:', err);
  }

  // Conectar Models

  const models = [User];

  models.forEach((model) => model.init(connection));
}
