const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const userSchema = Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        Admin: Number,
        Editor: Number,
        User: {
            type: Number,
            default: 2001
        }
    },
    refreshToken: String
});


module.exports = mongoose.model('User', userSchema);
