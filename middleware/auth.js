//Imports
const jwt = require('jsonwebtoken');
const config = require('config');

//Middleware function
function auth(req, res, next) {

    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded;
        return next();
    }
    catch(err) {
        return res.status(400).send('Invalid token.')
    };
};

//Exports
module.exports = auth;