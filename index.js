const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const app = express();
const uuid = require('uuid');
dotenv.config();
app.use(express.json());


app.post('/send-verification-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Missing "email"');
  }
  if (typeof email !== 'string') {
    return res.status(400).send('Bad "email" format');
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.strato.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });
  let verificationCode = uuid.v4();

  const mailOptions = {
    from: `No-reply <${process.env.EMAIL}>`,
    to: email,
    subject: 'Verification Code',
    text: `Your verification code is ${verificationCode}.`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({"status": "success", "code": verificationCode});
  } catch (error) {
    console.error(error);
    res.status(500).send(`Failed to send verification email (${error})`);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));