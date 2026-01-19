const nodemailer = require('nodemailer');

// Directly use environment variables instead of a hardcoded array
const GOOGLE_EMAIL = process.env.GOOGLE_VOICE_EMAIL;
const GOOGLE_APP_PASSWORD = process.env.GOOGLE_VOICE_APP_PASSWORD;
const GOOGLE_PHONE_NUMBER = process.env.GOOGLE_VOICE_PHONE_NUMBER;

async function sendWithGoogleVoice(to, message, gv_email = null) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GOOGLE_EMAIL,
      pass: GOOGLE_APP_PASSWORD
    }
  });

  let destiny;
  if (gv_email) {
    destiny = gv_email;
    console.log(`Continuando conversación existente con: ${destiny}`);
  } else {
    let cleanNumber = to.replace(/\D/g, '');
    if (cleanNumber.length === 11 && cleanNumber.startsWith('1')) {
      cleanNumber = cleanNumber.substring(1);
    }
    destiny = `${cleanNumber}@voice.google.com`;
    console.log(`Iniciando nueva conversación con: ${destiny}`);
  }

  console.log(`ENVIANDO DESDE TU NÚMERO REAL (${GOOGLE_PHONE_NUMBER || 'No configurado'}) a ${destiny}`);

  try {
    await transporter.sendMail({
      from: GOOGLE_EMAIL,
      to: destiny,
      subject: '', // Subject debe estar vacío para continuar el hilo
      text: message.trim(),
      html: message.trim()  // Google lo necesita en algunos casos
    });

    console.log(`¡ENVIADO PERFECTO DESDE TU NÚMERO REAL (${GOOGLE_PHONE_NUMBER})!`);
    return true;
  } catch (error) {
    console.error('Error enviando GV:', error.message);
    throw error;
  }
}

module.exports = { sendWithGoogleVoice };