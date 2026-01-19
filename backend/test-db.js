require('dotenv').config();
const pool = require('./db');

async function testDbConnection() {
    try {
        console.log('Attempting to connect to the database...');
        const client = await pool.connect();
        console.log('Successfully connected to the database!');

        console.log('Attempting to query email_templates table...');
        const res = await client.query('SELECT * FROM email_templates LIMIT 1');
        console.log('Successfully queried email_templates table. Found rows:', res.rows.length);

        console.log('Attempting to query campaigns table...');
        const res2 = await client.query('SELECT * FROM campaigns LIMIT 1');
        console.log('Successfully queried campaigns table. Found rows:', res2.rows.length);

        client.release();
        console.log('Database connection released.');
    } catch (err) {
        console.error('Database test failed:', err.message);
        if (err.code === '42P01') {
            console.error('Error: Table does not exist. Please ensure you have run lead-crm-schema.sql.');
        }
    } finally {
        // Ensure the pool is ended if this is a standalone script
        // pool.end(); // Only uncomment if this is the only script using the pool
    }
}

testDbConnection();
