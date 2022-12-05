const express = require('express');
const path = require('path');


const router = express.Router();
const viewsPath = 'views';
const indexBasename = 'index.html';
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


module.exports = router;
