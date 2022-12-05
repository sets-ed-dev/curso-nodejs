const jwt = require('jsonwebtoken');
require('dotenv').config();


const UNAUTHORIZED_HTTP_STATUS = 401;
const FORBIDDEN_HTTP_STATUS = 403;
const usersDataPath = '../models/users.json';
const data = {
    users: require(usersDataPath),
    setUsers: function(data) { this.users = data; }
}


const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;

    console.log(cookies);
    console.log(cookies.jwt);
    if (!cookies?.jwt) {
        return res.sendStatus(UNAUTHORIZED_HTTP_STATUS);
    }
    
    const refreshTokenReceived = cookies.jwt;
    const foundUser = data.users.find(usr => usr.refreshToken === refreshTokenReceived);

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

            // Create gain JWT access & refresh tokens.
            const roles = Object.values(decoded.roles);
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
