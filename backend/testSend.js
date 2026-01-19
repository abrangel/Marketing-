require('dotenv').config();
const nodemailer = require('nodemailer');

async function testSend() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: "tu_correo_de_prueba@gmail.com", // cámbialo por un correo real tuyo
      subject: "Prueba CRM",
      text: "Hola Pepito 🚀, este es un test aislado desde Nodemailer."
    });

    console.log("✅ Mensaje enviado:", info.messageId);
  } catch (err) {
    console.error("❌ Error en envío:", err);
  }
}

testSend();
