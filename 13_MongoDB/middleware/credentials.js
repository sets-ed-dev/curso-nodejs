const allowedOrigins = require('../config/allowedOrigins');


const acacHeader = 'Access-Control-Allow-Credentials';


const credentials = (req, res, next) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.headers(acacHeader, true);
    }

    next();
}


module.exports = credentials;
