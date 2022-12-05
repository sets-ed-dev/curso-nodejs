const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');


const BAD_REQUEST_HTTP_STATUS = 400;
const UNAUTHORIZED_HTTP_STATUS = 401;
const usersDataPath = '../models/users.json';
const backDir = '..';
const modelsDir = 'models';
const usersBasename = 'users.json';
const jwtKey = 'jwt';
const ONE_DAY_IN_MS = (24 * 60 * 60 * 1000);
const data = {
    users: require(usersDataPath),
    setUsers: function(data) { this.users = data; }
}


const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) {
        return res.status(BAD_REQUEST_HTTP_STATUS)
            .json({'message': 'Username & password are required!'});
    }

    const foundUser = data.users.find(usr => usr.username === user);

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
        const otherUsers = data.users.filter(u => u.username !== foundUser.username);
        const currentUser = {...foundUser, refreshToken};
        data.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, backDir, modelsDir, usersBasename),
            JSON.stringify(data.users)
        );
        
        // Sending response with generated JWT accessToken & a cookie with refreshToken.
        res.cookie(
            jwtKey,
            refreshToken,
            {
                httpOnly: true,
                maxAge: ONE_DAY_IN_MS,
                //secure: true,  // Only works in production deployment!
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
