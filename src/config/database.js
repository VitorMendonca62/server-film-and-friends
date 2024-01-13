import { config } from 'dotenv';

config();

export default {
  dialect: 'mysql',
  host: process.env.DATABASE_HOST,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.DATABASE_PORT,
  define: {
    timespamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
