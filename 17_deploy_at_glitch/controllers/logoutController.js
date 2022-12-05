const User = require('../models/Users');


const jwtCookie = 'jwt';
const EMPTY_STR = '';
const NOT_CONTENT_HTTP_STATUS = 204;


const handleLogout = async (req, res) => {
    // WARNING: Recommended on client also delete the accessToken.
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(NOT_CONTENT_HTTP_STATUS);
    }

    const refreshTokenReceived = cookies.jwt;
    // Test if refresh token is in data.users.
    const foundUser = await User.findOne({refreshToken: refreshTokenReceived}).exec();

    if (!foundUser) {
        res.clearCookie(
            jwtCookie,
            {
                // Same options like set auth cookies (except maxAge).
                httpOnly: true,
                secure: true,  // Only works in production deployment!
                sameSite: 'None' // Avoiding auth CORS problem using front-end code.
            }
        );
        return res.sendStatus(NOT_CONTENT_HTTP_STATUS);
    }

    // Delete refreshToken from data.users.
    // Every mongoose model object is treated like any other object, plus
    // rewriting any field and afterward calling save() the UPDATE
    // operation is done.
    foundUser.refreshToken = EMPTY_STR;
    await foundUser.save();

    res.clearCookie(
        jwtCookie,
        {
            httpOnly: true,
            secure: true,  // Only works in production deployment!
            sameSite: 'None' // Avoiding auth CORS problem using front-end code.
        }
    );
    res.sendStatus(NOT_CONTENT_HTTP_STATUS);
}


module.exports = {
    handleLogout
}
