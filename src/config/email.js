// eslint-disable-next-line import/no-extraneous-dependencies
import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'no.reply.movie.and.friends',
    pass: process.env.EMAIL_PASSWORD,
    clientId: process.env.EMAIL_ID,
    clientSecret: process.env.EMAIL_SECRET_ID,
    refreshToken: process.env.EMAIL_TOKEN,
  },
});

export default transporter;
