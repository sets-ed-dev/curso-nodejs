const express = require('express');
const authController = require('../controllers/authController');

router = express.Router();
rootRouteAuth = '/';


router.post(rootRouteAuth, authController.handleLogin);


module.exports = router;
