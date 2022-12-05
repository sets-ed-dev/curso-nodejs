const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');


const BAD_REQUEST_HTTP_STATUS = 400;
const CONFLICT_HTTP_STATUS = 409;
const INTERNAL_SERVER_ERROR_HTTP_STATUS = 500;
const CREATED_HTTP_STATUS = 201;
const HASH_SALTS = 10;
const backDir = '..';
const modelsDir = 'models';
const usersBasename = 'users.json';
const usersDataPath = '../models/users.json';
const data = {
    users: require(usersDataPath),
    setUsers: function(data) { this.users = data; }
}


const createUser = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) {
        return res.status(BAD_REQUEST_HTTP_STATUS)
            .json({'message': 'Username & password are required!'});
    }

    const usernameIsDuplicated = data.users.find(usr => usr.username === user);

    if (usernameIsDuplicated) {
        return res.sendStatus(CONFLICT_HTTP_STATUS);
    }

    try {
        const hashedPwd = await bcrypt.hash(pwd, HASH_SALTS);
        const newUser = {
            "username": user,
            "password": hashedPwd
        };

        data.setUsers([...data.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, backDir, modelsDir, usersBasename),
            JSON.stringify(data.users)
        );

        console.log(data.users);
        res.status(CREATED_HTTP_STATUS)
            .json({'message': `"${user}" has been created successfuly!`})
    } catch (error) {
        res.status(INTERNAL_SERVER_ERROR_HTTP_STATUS)
            .json({ 'message': error.message });
    }
}


module.exports = {
    createUser
}
