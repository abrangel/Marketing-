const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    console.log('Auth Middleware: Iniciado');
    console.log('Auth Middleware: Original URL:', req.originalUrl);

    // Skip authentication for the webhook route
    if (req.originalUrl === '/api/messages/webhook') {
        console.log('Auth Middleware: Saltando autenticación para webhook.');
        return next();
    }

    // Get token from header
    let token = req.header('x-auth-token');
    console.log('Auth Middleware: Token x-auth-token:', token ? 'Found' : 'Not Found');

    // If x-auth-token is not present, check for Authorization header
    if (!token) {
        const authHeader = req.header('Authorization');
        console.log('Auth Middleware: Authorization header:', authHeader ? 'Found' : 'Not Found');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.replace('Bearer ', '');
            console.log('Auth Middleware: Token Bearer Found');
        }
    }

    // Check if not token
    if (!token) {
        console.log('Auth Middleware: No token, authorization denied');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        console.log('Auth Middleware: Verificando token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        console.log('Auth Middleware: Token verificado. req.user establecido:', req.user);
        next();
    } catch (err) {
        console.log('Auth Middleware: Error al verificar token:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
