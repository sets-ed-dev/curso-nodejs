const express = require('express');
const path    = require('path');

const router = express.Router();
const viewsPath = 'views';
const backDir = '..';
const subdirPath = 'subdir';
const indexBasename = 'index.html';
const testBasename = 'test.html';


router.get(`^/$|/index(.html)?`, (req, res) => {
    res.sendFile(
        path.join(__dirname, backDir, viewsPath, subdirPath, indexBasename)
    );
});

router.get(`/test(.html)?`, (req, res) => {
    res.sendFile(
        path.join(__dirname, backDir, viewsPath, subdirPath, testBasename)
    );
});


module.exports = router;
