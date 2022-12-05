const User = require('../models/Users');


const BAD_REQUEST_HTTP_STATUS = 400;
const OK_HTTP_STATUS = 200;


const getAllUsers = async (req, res) => {
    const users = await User.find();

    if (!users)
        return res.status(NOT_CONTENT_HTTP_STATUS)
            .json({'message': 'There isn\'t any user!'});

    res.json(users);
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(BAD_REQUEST_HTTP_STATUS)
            .json({'message': 'Sorry Admin, Id parameter not provided via body!'});
    }

    const foundUser = await User.findOne({_id: req.body.id}).exec();

    if (!foundUser) {
        return res.status(BAD_REQUEST_HTTP_STATUS)
            .json({'message': `Sorry Admin, user with ID = ${req.body.id} not found!`});
    }

    const deleteOk = await User.deleteOne({_id: foundUser._id});

    res.json(deleteOk);
}


module.exports = {
    getAllUsers,
    deleteUser
}
