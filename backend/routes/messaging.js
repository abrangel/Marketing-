const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');
const axios = require('axios');

// CONFIG TextBee
const TEXTBEE_WEBHOOK_SECRET = process.env.TEXTBEE_WEBHOOK_SECRET;
const TEXTBEE_API_KEY = process.env.TEXTBEE_API_KEY;
const TEXTBEE_DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;
const TEXTBEE_CLOUD_API_BASE_URL = process.env.TEXTBEE_CLOUD_API_BASE_URL;

// FALLBACK GOOGLE VOICE
const { sendWithGoogleVoice } = require('../utils/googleVoice');

console.log('messaging.js cargado - Google Voice ACTIVADO');

// ==================== OBTENER MENSAJES ====================
router.get('/:leadId', auth, async (req, res) => {
  // console.log(`📍 GET /api/messages/${req.params.leadId}`); // Comentado para limpiar consola
  try {
    const conv = await pool.query(
      'SELECT id FROM conversations WHERE user_id = $1 AND lead_id = $2', 
      [req.user.id, req.params.leadId]
    );
    
    if (conv.rows.length === 0) {
      return res.json([]);
    }
    
    const messages = await pool.query(
      'SELECT * FROM messages WHERE conversation_id = $1 ORDER BY sent_at ASC', 
      [conv.rows[0].id]
    );
    
    res.json(messages.rows);
    
  } catch (err) {
    console.error('❌ Error obteniendo mensajes:', err);
    res.status(500).json({ error: 'Error interno' });
  }
});

// ==================== ENVIAR MENSAJE ====================
router.post('/lead/:leadId', auth, async (req, res) => {
  const { leadId } = req.params;
  const { message } = req.body;
  const userId = req.user.id;

  console.log(`✉️ ENVIANDO MENSAJE: lead ${leadId}, mensaje: "${message}"`);

  if (!message?.trim()) {
    return res.status(400).json({ success: false, msg: 'Mensaje vacío' });
  }

  try {
    // 1. Obtener teléfono y gv_email del lead
    const leadResult = await pool.query(
      'SELECT phone, gv_email FROM leads WHERE id = $1 AND user_id = $2', 
      [leadId, userId]
    );
    
    if (leadResult.rows.length === 0) {
      return res.status(404).json({ success: false, msg: 'Lead no encontrado' });
    }

    const { phone: rawPhone, gv_email } = leadResult.rows[0];
    let phone = rawPhone.replace(/\D/g, '');
    if (phone.length === 10) phone = '1' + phone;
    const recipientPhone = '+' + phone;

    let provider = 'TextBee';
    let sendSuccess = false;

    // 2. INTENTAR TEXTBEE
    try {
      const url = `${TEXTBEE_CLOUD_API_BASE_URL}/gateway/devices/${TEXTBEE_DEVICE_ID}/send-sms`;
      await axios.post(url, { 
        recipients: [recipientPhone], 
        message: message.trim() 
      }, { 
        headers: { 'x-api-key': TEXTBEE_API_KEY }, 
        timeout: 10000 
      });
      sendSuccess = true;
      console.log('✅ Enviado por TextBee');
    } catch (textbeeError) {
      const textbeeErrorMessage = textbeeError.response ? textbeeError.response.data : textbeeError.message;
      console.error('❌ TextBee falló:', textbeeErrorMessage);

      if (textbeeError.response && textbeeError.response.data && textbeeError.response.data.hasReachedLimit) {
        console.warn('⚠️ Límite diario de SMS de TextBee alcanzado. Intentando con Google Voice...');
      }
      
      // 3. FALLBACK A GOOGLE VOICE
      try {
        console.log('🔄 Intentando con Google Voice...');
        await sendWithGoogleVoice(recipientPhone, message.trim(), gv_email); // Pasamos gv_email
        sendSuccess = true;
        provider = 'Google Voice';
        console.log('✅ Enviado por Google Voice');
      } catch (gvError) {
        console.error('❌ Google Voice también falló:', gvError.message);
        sendSuccess = false;
      }
    }

    // 4. GUARDAR EN BASE DE DATOS
    const savedMessage = await saveMessage(userId, leadId, message.trim(), 'user');

    if (sendSuccess) {
      res.json(savedMessage); 
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'No se pudo enviar el SMS (Error de proveedor)' 
      });
    }

  } catch (err) {
    console.error('❌ Error en router.post:', err);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// ==================== ENVIAR MENSAJE DIRECTO GOOGLE VOICE ====================
router.post('/gv-reply/:leadId', auth, async (req, res) => {
  const { leadId } = req.params;
  const { message } = req.body;
  const userId = req.user.id;

  console.log(`✉️ ENVIANDO GOOGLE VOICE REPLY: lead ${leadId}, mensaje: "${message}"`);

  if (!message?.trim()) {
    return res.status(400).json({ success: false, msg: 'Mensaje vacío' });
  }

  try {
    // 1. Obtener gv_email del lead
    const leadResult = await pool.query(
      'SELECT gv_email, phone FROM leads WHERE id = $1 AND user_id = $2',
      [leadId, userId]
    );

    if (leadResult.rows.length === 0) {
      return res.status(404).json({ success: false, msg: 'Lead no encontrado' });
    }

    const { gv_email, phone } = leadResult.rows[0];

    if (!gv_email) {
      return res.status(400).json({ success: false, msg: 'Este lead no tiene una conversación de Google Voice activa.' });
    }

    // 2. Enviar directamente con Google Voice
    await sendWithGoogleVoice(phone, message.trim(), gv_email);
    console.log(`✅ Enviado por Google Voice a ${gv_email}`);

    // 3. Guardar en la base de datos
    const savedMessage = await saveMessage(userId, leadId, message.trim(), 'user');

    res.json(savedMessage);

  } catch (err) {
    console.error('❌ Error en router.post (gv-reply):', err);
    res.status(500).json({ success: false, error: 'No se pudo enviar el mensaje a través de Google Voice' });
  }
});

// FUNCIÓN AUXILIAR PARA GUARDAR
async function saveMessage(userId, leadId, message, senderType) {
  try {
    // Buscar o crear conversación
    let conv = await pool.query(
      'SELECT id FROM conversations WHERE user_id = $1 AND lead_id = $2', 
      [userId, leadId]
    );
    
    let conversationId;
    if (conv.rows.length === 0) {
      const newConv = await pool.query(
        'INSERT INTO conversations (user_id, lead_id) VALUES ($1, $2) RETURNING id', 
        [userId, leadId]
      );
      conversationId = newConv.rows[0].id;
    } else {
      conversationId = conv.rows[0].id;
    }

    // Insertar mensaje y DEVOLVERLO (RETURNING *)
    const newMessage = await pool.query(
      `INSERT INTO messages (conversation_id, sender_type, sender_id, body, sent_at) 
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) 
       RETURNING *`,
      [conversationId, senderType, userId, message]
    );

    // Actualizar timestamp de conversación
    await pool.query(
      'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', 
      [conversationId]
    );
    
    return newMessage.rows[0]; // Devolvemos el objeto mensaje completo

  } catch (err) {
    console.error('❌ Error guardando mensaje en DB:', err);
    throw err;
  }
}

module.exports = router;