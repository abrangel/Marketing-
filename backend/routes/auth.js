const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../db');

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await pool.query('SELECT id, email FROM users WHERE id = $1', [req.user.id]);
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
