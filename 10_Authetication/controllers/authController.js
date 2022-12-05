const bcrypt = require('bcrypt');


const BAD_REQUEST_HTTP_STATUS = 400;
const CONFLICT_HTTP_STATUS = 409;
const INTERNAL_SERVER_ERROR_HTTP_STATUS = 500;
const CREATED_HTTP_STATUS = 201;
const UNAUTHORIZED_HTTP_STATUS = 401;
const backDir = '..';
const modelsDir = 'models';
const usersBasename = 'users.json';
const usersDataPath = '../models/users.json';
const data = {
    users: require(usersDataPath),
    // setUsers: function(data) { this.users = data; }
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
        // TODO: Create JWTs: normal & refresh.
        res.json({'message': `"${foundUser.username}" is logged in sucessfully!`});
    } else {
        return res.sendStatus(UNAUTHORIZED_HTTP_STATUS);
    }
}


module.exports = {
    handleLogin
}
