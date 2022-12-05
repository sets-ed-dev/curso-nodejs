const User = require('../models/Users');
const bcrypt = require('bcrypt');


const BAD_REQUEST_HTTP_STATUS = 400;
const CONFLICT_HTTP_STATUS = 409;
const INTERNAL_SERVER_ERROR_HTTP_STATUS = 500;
const CREATED_HTTP_STATUS = 201;
const HASH_SALTS = 10;

 
const createUser = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) {
        return res.status(BAD_REQUEST_HTTP_STATUS)
            .json({'message': 'Username & password are required!'});
    }

    const usernameIsDuplicated = await User.findOne({username: user}).exec();
    
    if (usernameIsDuplicated) {
        return res.sendStatus(CONFLICT_HTTP_STATUS);
    }

    try {
        const hashedPwd = await bcrypt.hash(pwd, HASH_SALTS);
        
        const newUser = await User.create({
            "username": user,
            "password": hashedPwd
        });

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
