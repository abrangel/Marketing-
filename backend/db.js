// backend/db.js - VERSIÓN CORREGIDA Y 100% FUNCIONAL
const { Pool } = require('pg');

console.log('DEBUG: DB_PASSWORD:', process.env.DB_PASSWORD);
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// FUNCIÓN PARA CONECTAR Y VERIFICAR LA DB
const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL conectado correctamente');
    client.release(); // liberamos el cliente
  } catch (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    process.exit(1); // matamos el server si no hay DB
  }
};

// Exportamos AMBAS cosas
module.exports = {
  pool,       // para usar en las rutas (pool.query)
  connectDB  // para llamar al inicio (connectDB())
};

console.log('db.js cargado - pool y connectDB listos');