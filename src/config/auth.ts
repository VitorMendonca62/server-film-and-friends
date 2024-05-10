import { config } from 'dotenv';

config();

export default {
  secret: process.env.AUTH_SECRET as string,
  expiresIn: '2D',
};
