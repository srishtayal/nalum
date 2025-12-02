const nodemailer = require("nodemailer");
const mailConfig = require("../config/mail.config");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: mailConfig.EMAIL,
    pass: mailConfig.PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
    minVersion: "TLSv1.2"
  }
});

exports.sendMail = async (recipient, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: `"${mailConfig.NAME}" <${mailConfig.EMAIL}>`,
      to: recipient,
      subject: subject,
      text: text,
      html: html,
    });
    return { error: false };
  } catch (error) {
    console.error("Mailer error:", error);
    return { error: true, message: error.message };
  }
};