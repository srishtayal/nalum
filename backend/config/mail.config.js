require('dotenv').config();

module.exports = {
  SMTP_HOST: process.env.BREVO_SMTP_HOST,
  SMTP_PORT: process.env.BREVO_SMTP_PORT,
  SMTP_USER: process.env.BREVO_SMTP_USER,
  SMTP_PASS: process.env.BREVO_SMTP_PASS,
  FROM_NAME: process.env.MAIL_FROM_NAME,
  FROM_EMAIL: process.env.MAIL_FROM_EMAIL,
};
