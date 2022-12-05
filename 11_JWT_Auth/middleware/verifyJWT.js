const jwt = require('jsonwebtoken');
require('dotenv').config()


const authHeaderKey = 'authorization';
const UNAUTHORIZED_HTTP_CODE_STATUS = 401;
const FORBIDDEN_HTTP_CODE_STATUS = 403;
const ONE_SPACE = ' ';
const TOKEN_SPLIT_INDEX = 1;


const verifyAuth = (req, res, next) => {
    const authHeader = req.headers[authHeaderKey]

    if (!authHeader)
        return res.sendStatus(UNAUTHORIZED_HTTP_CODE_STATUS);

    const token = authHeader.split(ONE_SPACE)[TOKEN_SPLIT_INDEX];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err)
                return res.sendStatus(FORBIDDEN_HTTP_CODE_STATUS);
            
            req.user = decoded.username;
            next();
        }
    );
}


module.exports = verifyAuth;
