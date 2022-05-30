const jwt = require('jsonwebtoken');


//tested
exports.verifyToken = (req, res, next) => {
    const token = req.header('JWT-AUTH');
    if (!token) {
        return res.status(401).json({ error: 'Forbidden' });
    }
    try {
        jwt.verify(token, 'secretkey');

        next();
    } catch (error) {
        return res.status(400).json({ error: 'Access denied' })
    }
}
