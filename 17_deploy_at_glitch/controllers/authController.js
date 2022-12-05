const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');


const BAD_REQUEST_HTTP_STATUS = 400;
const UNAUTHORIZED_HTTP_STATUS = 401;
const jwtKey = 'jwt';
const ONE_DAY_IN_MS = (24 * 60 * 60 * 1000);


const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) {
        return res.status(BAD_REQUEST_HTTP_STATUS)
            .json({'message': 'Username & password are required!'});
    }

    const foundUser = await User.findOne({username: user}).exec();

    if (!foundUser) {
        return res.sendStatus(UNAUTHORIZED_HTTP_STATUS);
    }

    const matchPwd = await bcrypt.compare(pwd, foundUser.password);

    if (matchPwd) {
        // Get the sent roles.
        const roles = Object.values(foundUser.roles);
        // Create JWTs: access & refresh.
        const accessToken = jwt.sign(
            // Payload.
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            // env.ACCESS_TOKEN_SECRET loaded thanks to require dotenv.
            process.env.ACCESS_TOKEN_SECRET,
            // JWT options.
            {expiresIn: '30s'}
        );
        const refreshToken = jwt.sign(
            // Payload.
            {"username": foundUser.username},
            // env.REFRESH_TOKEN_SECRET loaded thanks to require dotenv.
            process.env.REFRESH_TOKEN_SECRET,
            // JWT options.
            {expiresIn: '1d'}
        );

        // Saving refreshToken with current user.
        foundUser.refreshToken = refreshToken;
        await foundUser.save();
        
        // Sending response with generated JWT accessToken & a cookie with refreshToken.
        res.cookie(
            jwtKey,
            refreshToken,
            {
                httpOnly: true,
                maxAge: ONE_DAY_IN_MS,
                secure: true,  // Only works in production deployment!
                sameSite: 'None' // Avoiding auth CORS problem using front-end code.
            }
        );
        res.json({accessToken});
    } else {
        return res.sendStatus(UNAUTHORIZED_HTTP_STATUS);
    }
}


module.exports = {
    handleLogin
}
