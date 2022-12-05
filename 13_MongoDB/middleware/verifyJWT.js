const jwt = require('jsonwebtoken');


const UNAUTHORIZED_HTTP_CODE_STATUS = 401;
const FORBIDDEN_HTTP_CODE_STATUS = 403;
const ONE_SPACE = ' ';
const TOKEN_SPLIT_INDEX = 1;
const BEARER_INI = 'Bearer ';


const verifyAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith(BEARER_INI))
        return res.sendStatus(UNAUTHORIZED_HTTP_CODE_STATUS);

    const token = authHeader.split(ONE_SPACE)[TOKEN_SPLIT_INDEX];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err)
                return res.sendStatus(FORBIDDEN_HTTP_CODE_STATUS);
            
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}


module.exports = verifyAuth;
