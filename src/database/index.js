// Modules
import { Sequelize } from 'sequelize';

// Models
import User from '../app/models/User.js';
import Film from '../app/models/Film.js';

// Config
import configDatabase from '../config/database.js';

// Connection
export const connection = new Sequelize(configDatabase);

export function startDatabase() {
  try {
    connection.authenticate();
    console.log('[DATABASE] Database connected successfully');
  } catch (err) {
    console.log('[DATABASE] Database connection was interrupted:', err);
  }

  // Conectar Models

  const models = [User, Film];

  models.forEach((model) => model.init(connection));
}
