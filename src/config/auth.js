import { config } from 'dotenv';

config();

export default {
  secret: process.env.AUTH_SECRET,
  expiresIn: '2D',
};
