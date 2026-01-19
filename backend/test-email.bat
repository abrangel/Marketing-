@echo off
REM Cargar variables desde .env y ejecutar Node
node -e "require('dotenv').config(); 
const nodemailer = require('nodemailer'); 
(async () => { 
  try { 
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test desde Lead CRM',
      text: '¡Hola Pepito! El envío de correo funciona 🚀'
    });
    console.log('Correo enviado ✅:', info.messageId);
  } catch (err) { console.error('Error ❌:', err); }
})();"
pause
