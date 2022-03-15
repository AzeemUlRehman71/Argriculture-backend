const Email = require('email-templates');
const nodemailer = require('nodemailer');
const path = require("path");
// const root = path.join(__dirname, 'src/emails');
const root = path.join(__dirname, 'emails');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
   // secure: true,
   // ssl: true,
    // upgrade later with STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  const email = new Email({
    preview: false,
    message: {
      from: 'noreply@mybtllc.com'
    },
    // uncomment below to send emails in development/test env:
    send: true,
    //transport: {
    //  jsonTransport: true
    //}
    transport: transporter
  });

  module.exports = email;