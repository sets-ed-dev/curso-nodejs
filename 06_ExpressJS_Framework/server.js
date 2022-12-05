const { vi } = require('date-fns/locale');
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3500;
const rootPath = '/';
const viewsPath = 'views';
const indexBasename = 'index.html';
const newPageBasename = 'new-page.html';
const notFoundBasename = '404.html';
const MOVED_PERMANENTLY_HTTP_STATUS = 301;
const NOT_FOUND_HTTP_STATUS = 404;

// 0. For requests looking for rootPath. The regular expression basics are:
// - ^ = That begins with.
// - $ The ends with.
// - () = Optional pattern.
// - | = OR logical operator.
// - * = All wildcard.
app.get(`^/$|/index(.html)?`, (req, res) => {
    // 1. Answer with response with text/plain
    // res.send('Hello, ExpressJS!');

    // 2. Answer to request with file (2 ways)
    // res.sendFile(
    //     path.join(viewsPath, indexBasename),
    //     {root: __dirname}
    // );
    res.sendFile(
        path.join(__dirname, viewsPath, indexBasename)
    );
});

// 1. For get requests that looks for new-page.html
app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, viewsPath, newPageBasename));
});

// 2. For get requests that looks for old-page.html, redirects with correct http status.
// redirect() by default responses with 302 = FOUND.
app.get('/old-page(.html)?', (req, res) => {
    res.redirect(MOVED_PERMANENTLY_HTTP_STATUS, '/new-page.html');
});

// 3. Route handlers: a callback named next when a request reaches the route.
app.get('/hello(.html)?', (req, res, next) => {
    console.log('Attempted to get hello.html!');
    next();
}, (req, res) => {
    res.send('Hello world!');
});

// 4. Chain route handlers, with next function & an array containing these handlers.
const one = (req, res, next) => {
    console.log('One ...');
    next();
}

const two = (req, res, next) => {
    console.log('Two ...');
    next();
}

const three = (req, res) => {
    console.log('Three!');
    res.send('Finished!');
}

app.get('/chain(.html)?', [one, two, three]);

// 5. LAST RESORT: For get requests that doesn't find resources (404 code).
app.get('/*', (req, res) => {
    res.status(NOT_FOUND_HTTP_STATUS)
       .sendFile(path.join(__dirname, viewsPath, notFoundBasename));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
