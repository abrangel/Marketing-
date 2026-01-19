const Imap = require('imap');
const { simpleParser } = require('mailparser');
const { pool } = require('../db');

const IMAP_CONFIG = {
  user: process.env.GOOGLE_VOICE_EMAIL,
  password: process.env.GOOGLE_VOICE_APP_PASSWORD,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
};

let imap;
let checkerInterval;

// 1. GUARDAR MENSAJE EN DB
async function saveMessage(userId, leadId, message, senderType, sentAt) {
  if (!message || !message.trim()) return false;
  try {
    let conv = await pool.query('SELECT id FROM conversations WHERE user_id = $1 AND lead_id = $2', [userId, leadId]);
    let conversationId;
    if (conv.rows.length === 0) {
      const newConv = await pool.query('INSERT INTO conversations (user_id, lead_id) VALUES ($1, $2) RETURNING id', [userId, leadId]);
      conversationId = newConv.rows[0].id;
    } else {
      conversationId = conv.rows[0].id;
    }

    await pool.query(
      `INSERT INTO messages (conversation_id, sender_type, sender_id, body, sent_at) VALUES ($1, $2, $3, $4, $5)`,
      [conversationId, senderType, userId, message.trim(), sentAt || new Date()]
    );
    await pool.query('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [conversationId]);
    
    console.log(`💾 Mensaje GUARDADO para lead ${leadId}`);
    return true;
  } catch (err) {
    console.error('❌ Error guardando mensaje:', err.message);
    return false;
  }
}

// 2. PROCESAR CORREO (MODIFICADO para recibir objeto parseado)
async function processGoogleVoiceEmail(parsed) {
  try {
    const subject = parsed.subject || '';
    const bodyText = parsed.text || '';
    
    const magicEmail = parsed.from?.value[0]?.address || ''; 

    const phoneRegex = /\(?(\d{3})\)?\s*(\d{3})[-. ]?(\d{4})/;
    const match = subject.match(phoneRegex);
    if (!match) return false;

    const phoneNum = `1${match[1]}${match[2]}${match[3]}`;
    const phoneNumSimple = `${match[1]}${match[2]}${match[3]}`;

    let smsBody = '';
    const lines = bodyText.split('\n');
    for (let line of lines) {
        let l = line.trim();
        if (l.length > 0 && !l.includes('google.com') && !l.includes('voice-noreply') && !l.includes('YOUR ACCOUNT')) {
            smsBody = l;
            break;
        }
    }
    if (!smsBody) return false;

    console.log(`📨 SMS recibido de ${phoneNum}. Email secreto: ${magicEmail}`);

    const leadRes = await pool.query(
        "SELECT * FROM leads WHERE phone LIKE $1 OR phone LIKE $2 LIMIT 1", 
        [`%${phoneNumSimple}%`, `%${phoneNum}%`]
    );

    if (leadRes.rows.length === 0) {
        console.log(`⚠️ Lead no encontrado para ${phoneNum}`);
        return false;
    }

    const lead = leadRes.rows[0];

    if (magicEmail.includes('voice.google.com')) {
        await pool.query('UPDATE leads SET gv_email = $1 WHERE id = $2', [magicEmail, lead.id]);
        console.log(`✅ Dirección secreta actualizada para ${lead.name}`);
    }

    return await saveMessage(lead.user_id, lead.id, smsBody, 'lead', parsed.date);

  } catch (err) {
    console.error('❌ Error procesando email:', err.message);
    return false;
  }
}

// 3. CHECKER (CORREGIDO para evitar duplicados)
function checkInbox() {
    if (!imap || imap.state !== 'authenticated') return;

    imap.openBox('INBOX', false, (err, box) => {
        if (err) {
            console.error("IMAP openBox error:", err);
            return;
        }

        imap.search(['UNSEEN', ['OR', ['FROM', 'txt.voice.google.com'], ['FROM', 'voice-noreply@google.com']]], (err, uids) => {
            if (err || !uids || uids.length === 0) {
                return;
            }

            const fetch = imap.fetch(uids, { bodies: '' });

            fetch.on('message', (msg, seqno) => {
                let uid;
                msg.on('attributes', (attrs) => {
                    uid = attrs.uid;
                });

                msg.on('body', (stream) => {
                    simpleParser(stream, async (err, parsed) => {
                        if (err) {
                            console.error('❌ Error parseando email:', err);
                            return;
                        }

                        const success = await processGoogleVoiceEmail(parsed);

                        if (success && uid) {
                            imap.addFlags(uid, ['\\Deleted'], (flagErr) => {
                                if (flagErr) {
                                    console.error(`❌ Error marcando UID ${uid} para eliminación:`, flagErr);
                                } else {
                                    console.log(`🗑️ Mensaje UID ${uid} marcado para eliminación.`);
                                }
                            });
                        }
                    });
                });
            });
        });
    });
}

async function connectImap() {
  imap = new Imap(IMAP_CONFIG);

  // DEBUG: Añadido para obtener más detalles de la conexión
  imap.on('debug', function(message) {
    console.log('[IMAP DEBUG]', message);
  });

  imap.once('ready', () => {
    console.log('✅ IMAP Conectado');
    if (checkerInterval) clearInterval(checkerInterval);
    checkerInterval = setInterval(checkInbox, 10000);
    checkInbox();
  });
  imap.once('error', (err) => {
    console.error('❌ Error IMAP Detallado (Reconectando...):', err);
    setTimeout(connectImap, 15000);
  });
  imap.connect();
}

function startGoogleVoiceInboxChecker() { if (process.env.GOOGLE_VOICE_EMAIL) connectImap(); }
function stopGoogleVoiceInboxChecker() { if (checkerInterval) clearInterval(checkerInterval); if (imap) imap.end(); }
module.exports = { startGoogleVoiceInboxChecker, stopGoogleVoiceInboxChecker };
