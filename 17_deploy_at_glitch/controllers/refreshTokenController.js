const User = require('../models/Users');
const jwt = require('jsonwebtoken');


const UNAUTHORIZED_HTTP_STATUS = 401;
const FORBIDDEN_HTTP_STATUS = 403;


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(UNAUTHORIZED_HTTP_STATUS);
    }
    
    const refreshTokenReceived = cookies.jwt;
    const foundUser = await User.findOne({refreshToken: refreshTokenReceived}).exec();

    if (!foundUser) {
        return res.sendStatus(FORBIDDEN_HTTP_STATUS);
    }

    jwt.verify(
        refreshTokenReceived,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) {
                res.sendStatus(FORBIDDEN_HTTP_STATUS);
            }

            // Create again JWT access & refresh tokens.
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            );

            // Send response with new access token.
            res.json({accessToken});
        }
    );
}


module.exports = {
    handleRefreshToken
}
