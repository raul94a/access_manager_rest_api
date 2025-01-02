const jwt = require('jsonwebtoken');
const env = require('../config/env.json')
const { authLogger, message } = require('../utils/logger');
//tested
exports.verifyToken = (req, res, next) => {
    const token = req.header('JWT-AUTH');
    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
        req.socket.remoteAddress


    if (!token) {

        authLogger.warn(message(req, 401, 'Forbidden', 'No token'))
        return res.status(401).json({ error: 'Forbidden' });
    }
    try {
        jwt.verify(token, env['jwt-secret']);

        next();
    } catch (error) {
        authLogger.warn(message(req, 403, 'Forbidden', 'bad token')
        )

        return res.status(403).json({ error: 'Access denied' })
    }
}
