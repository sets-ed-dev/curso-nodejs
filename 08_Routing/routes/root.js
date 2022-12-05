const express = require('express');
const path = require('path');


const router = express.Router();
const viewsPath = 'views';
const indexBasename = 'index.html';
const newPageBasename = 'new-page.html';
const MOVED_PERMANENTLY_HTTP_STATUS = 301;
const backDir = '..';


// 0. For requests looking for rootPath. The regular expression basics are:
// - ^ = That begins with.
// - $ The ends with.
// - () = Optional pattern.
// - | = OR logical operator.
// - * = All wildcard.
router.get(`^/$|/index(.html)?`, (req, res) => {
    // 1. Answer with response with text/plain
    // res.send('Hello, ExpressJS!');

    // 2. Answer to request with file (2 ways)
    // res.sendFile(
    //     path.join(viewsPath, indexBasename),
    //     {root: __dirname}
    // );
    res.sendFile(
        path.join(__dirname, backDir, viewsPath, indexBasename)
    );
});

// 1. For get requests that looks for new-page.html
router.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, backDir, viewsPath, newPageBasename));
});

// 2. For get requests that looks for old-page.html, redirects with correct http status.
// redirect() by default responses with 302 = FOUND.
router.get('/old-page(.html)?', (req, res) => {
    res.redirect(MOVED_PERMANENTLY_HTTP_STATUS, '/new-page.html');
});


module.exports = router;
