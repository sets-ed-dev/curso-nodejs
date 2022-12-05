const express = require('express');
const usersController = require('../controllers/registerController');

router = express.Router();
rootRouteRegister = '/';


router.post(rootRouteRegister, usersController.createUser);


module.exports = router;
