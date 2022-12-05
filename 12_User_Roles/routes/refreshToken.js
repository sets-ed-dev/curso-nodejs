const express = require('express');
const refreshTokenController = require('../controllers/refreshTokenController');

router = express.Router();
rootRouteRefreshToken = '/';


router.get(rootRouteRefreshToken, refreshTokenController.handleRefreshToken);


module.exports = router;
