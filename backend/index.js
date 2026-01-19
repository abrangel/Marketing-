// backend/index.js - VERSIÓN FINAL 100% FUNCIONAL NOVIEMBRE 2025
const express = require('express');
const cors = require('cors');
console.log('INDEX.JS FILE LOADED - VERSION CORREGIDA');

require('dotenv').config();
const { connectDB } = require('./db');
const { startGoogleVoiceInboxChecker } = require('./utils/googleVoiceInbox');

const app = express();
const port = process.env.PORT || 3001;

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// Logging
app.use((req, res, next) => {
  console.log(`📍 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// RUTAS (con .js para Node v24)
console.log('🔍 Cargando rutas...');
app.use('/api/users', require('./routes/users.js'));
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/leads', require('./routes/leads.js'));
app.use('/api/email', require('./routes/email.js'));
app.use('/api/messages', require('./routes/messaging.js'));
console.log('✅ Todas las rutas cargadas');

// Ruta de test
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Server funcionando perfecto' });
});

// 404 - CORREGIDO (sin *)
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada' });
});

// Iniciar DB y server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🌐 Local: http://localhost:${port}`);
    console.log('✅ Servidor listo');
    startGoogleVoiceInboxChecker();
  });
}).catch(err => {
  console.error('❌ Error DB:', err.message);
  process.exit(1);
});