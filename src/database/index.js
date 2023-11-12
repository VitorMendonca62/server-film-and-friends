/* eslint-disable import/no-extraneous-dependencies */
import { Sequelize } from 'sequelize';
import configDatabase from '../config/database.js';

// Conexão
export const connection = new Sequelize(configDatabase);

export function startDatabase() {
  try {
    connection.authenticate();
    console.log('[DATABASE] Database connected successfully');
  } catch (err) {
    console.log('[DATABASE] Database connection was interrupted:', err);
  }

  // Models

  // import  from "../app/models/"

  // const models = []

  // models.forEach(model => model.init(connection));
}
