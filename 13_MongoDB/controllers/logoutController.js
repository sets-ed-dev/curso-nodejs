const fsPromises = require('fs').promises;
const path = require('path');
require('dotenv').config()


const jwtCookie = 'jwt';
const EMPTY_STR = '';
const NOT_CONTENT_HTTP_STATUS = 204;
const backDir = '..';
const modelsDir = 'models';
const usersBasename = 'users.json';
const usersDataPath = '../models/users.json';
const data = {
    users: require(usersDataPath),
    setUsers: function(data) { this.users = data; }
}


const handleLogout = async (req, res) => {
    // WARNING: Recommended on client also delete the accessToken.
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(NOT_CONTENT_HTTP_STATUS);
    }

    const refreshTokenReceived = cookies.jwt;
    // Test if refresh token is in data.users.
    const foundUser = data.users.find(usr => usr.refreshToken === refreshTokenReceived);

    if (!foundUser) {
        res.clearCookie(
            jwtCookie,
            {
                // Same options like set auth cookies (except maxAge).
                httpOnly: true,
                // secure: true,  // Only works in production deployment!
                sameSite: 'None' // Avoiding auth CORS problem using front-end code.
            }
        );
        return res.sendStatus(NOT_CONTENT_HTTP_STATUS);
    }

    // Delete refreshToken from data.users.
    const otherUsers = data.users.filter(usr => usr.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: EMPTY_STR};
    data.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, backDir, modelsDir, usersBasename),
        JSON.stringify(data.users)
    );
    res.clearCookie(
        jwtCookie,
        {
            httpOnly: true,
            // secure: true,  // Only works in production deployment!
            sameSite: 'None' // Avoiding auth CORS problem using front-end code.
        }
    );
    res.sendStatus(NOT_CONTENT_HTTP_STATUS);
}


module.exports = {
    handleLogout
}
