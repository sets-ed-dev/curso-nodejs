const express = require('express');
const logoutController = require('../controllers/logoutController');


router = express.Router();
rootRouteLogout = '/';


router.get(rootRouteLogout, logoutController.handleLogout);


module.exports = router;
