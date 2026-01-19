#!/bin/bash

# Cargar variables desde .env
export $(grep -v '^#' .env | xargs)

# Ejecutar un script Node inline para enviar correo de prueba
node - <<'EOF'
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false, // true si usas puerto 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

(async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // te lo envías a ti mismo
      subject: "Test desde Lead CRM",
      text: "¡Hola Pepito! El envío de correo funciona 🚀",
    });
    console.log("Correo enviado ✅:", info.messageId);
  } catch (err) {
    console.error("Error ❌:", err);
  }
})();
EOF
