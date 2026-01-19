// import-history.js → VERSIÓN QUE FUNCIONA AL 100% CON TEXTBEE.DEV
const axios = require('axios');
require('dotenv').config();
const pool = require('./db');

const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;
const BASE_URL = 'https://api.textbee.dev/api/v1';

async function importarHistorialCompleto() {
  console.log('🚀 Iniciando importación del historial REAL de Textbee.dev...');

  try {
    const response = await axios.get(
      `${BASE_URL}/gateway/devices/${DEVICE_ID}/get-received-sms`,
      {
        headers: { 'x-api-key': API_KEY }
      }
    );

    // Textbee devuelve un array directo o dentro de .data
    let messages = response.data;
    if (response.data.data) messages = response.data.data;
    if (!Array.isArray(messages)) {
      console.log('Respuesta inesperada:', response.data);
      return;
    }

    if (messages.length === 0) {
      console.log('No hay mensajes recibidos en Textbee.dev');
      return;
    }

    console.log(`✅ Encontrados ${messages.length} mensajes recibidos`);

    let importados = 0;
    for (const msg of messages) {
      const fromPhone = (msg.from || msg.sender || '').replace(/\D/g, '');
      const body = msg.message || msg.text || msg.body || '';
      const sentAt = new Date(msg.timestamp || msg.date || msg.created_at || Date.now());

      if (!fromPhone || !body) continue;

      // 1. Lead (buscar o crear)
      let leadRes = await pool.query(
        `SELECT id FROM leads WHERE REPLACE(phone, '+', '') LIKE $1`,
        [fromPhone]
      );
      let leadId;
      if (leadRes.rows.length === 0) {
        const nuevo = await pool.query(
          `INSERT INTO leads (user_id, name, phone, status) 
           VALUES (1, $1, $2, 'New') RETURNING id`,
          [`Cliente ${fromPhone}`, `+${fromPhone}`]
        );
        leadId = nuevo.rows[0].id;
        console.log(`Nuevo lead creado: +${fromPhone}`);
      } else {
        leadId = leadRes.rows[0].id;
      }

      // 2. Conversación
      let convRes = await pool.query(`SELECT id FROM conversations WHERE lead_id = $1`, [leadId]);
      let convId;
      if (convRes.rows.length === 0) {
        const nc = await pool.query(
          `INSERT INTO conversations (user_id, lead_id) VALUES (1, $1) RETURNING id`,
          [leadId]
        );
        convId = nc.rows[0].id;
      } else {
        convId = convRes.rows[0].id;
      }

      // 3. Insertar mensaje
      await pool.query(
        `INSERT INTO messages (conversation_id, body, sender_type, sender_id, sent_at)
         VALUES ($1, $2, 'lead', $3, $4)
         ON CONFLICT DO NOTHING`,
        [convId, body, leadId, sentAt]
      );

      importados++;
    }

    console.log(`🎉 ¡TERMINADO! Se importaron ${importados} mensajes antiguos.`);
    console.log('Actualiza tu CRM local → selecciona el lead → ¡los verás todos!');
    
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

importarHistorialCompleto();