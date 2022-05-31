const jwt = require('jsonwebtoken');
const env =  require('../config/env.json')
const authLogger= require('../utils/logger').authLogger;
//tested
exports.verifyToken = (req, res, next) => {
    const token = req.header('JWT-AUTH');
    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
         req.socket.remoteAddress
         
    //      console.log('IP IP I PIP ==========================================')
    //      console.log('==========================================')
    // console.log(ip);
    // console.log(req.url)
  
    // console.log('==========================================')
    // console.log('==========================================')
    // console.log('==========================================')
    // console.log('==========================================')

    if (!token) {
        authLogger.warn(`Forbiden request to ${req.url} from ${ip} with a status code of 401; no token in header`)
        return res.status(401).json({ error: 'Forbidden' });
    }
    try {
        jwt.verify(token, env['jwt-secret']);

        next();
    } catch (error) {
        authLogger.warn(`Forbiden request to ${req.url} from ${ip} with a status code of 400; access denied likely to bad token`)

        return res.status(400).json({ error: 'Access denied' })
    }
}
