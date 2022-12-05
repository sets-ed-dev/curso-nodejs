const { vi } = require('date-fns/locale');
const express = require('express');
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const expressJsErrorHandler = require('./middleware/expressJsErrorHandler');


const app = express();
const PORT = process.env.PORT || 3500;
const rootPath = '/';
const publicPath = 'public';
const viewsPath = 'views';
const notFoundBasename = '404.html';
const NOT_FOUND_HTTP_STATUS = 404;
const OK_HTTP_STATUS = 200;
const notFoundMsg = '404 - Not Found';
const subdirRoute = '/subdir';
const subdirRouteDir = './routes/subdir';
const rootRoute = '/';
const rootRouteDir = './routes/root';
const apiEmployeesRoute = '/employees';
const apiEmployeeRouteDir = './routes/api/employees';


// MIDDLEWARE TIME!
//
// Middleware is all process between the request reception & answering (response).
// for all routes after them. These are used by express().use(), there are 3 kinds
// of middleware in ExpressJS:
// 
// I. Built-in (into ExpressJS).
// II. Custom (we're the developers).
// III. Third-parties (from other developers).

// 7. CUSTOM MIDDLEWARE:
// You can use them in-line code of external folder (check middleware folder).
app.use(logger);

// 8. THIRD -PARTY MIDDLEWARE:
// Example is the CORS package, CORS = Cross Origin Resource Sharing, avoids CORS
// exceptions between different request-response origins.
const whiteList = [
    'http://www.yourcompany.com', // you set your domain here
    'http://127.0.0.1:5500',
    'http://127.0.0.1:3500',
    'https://www.google.com'
];
const corsOptions = {
    optionsSuccessStatus: OK_HTTP_STATUS,
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Request not allowed by CORS (you aren\'t in the whitelist).'));
        }
    }
};
app.use(cors(corsOptions));

// 6. BUILT-IN MIDDLEWARE:
// 6.1 For html form submitted data:
app.use(express.urlencoded({ extended: false }));
// 6.2 For json.
app.use(express.json());
// 6.3 For serving static files for specofied directory (default: '/').
app.use(rootRoute, express.static(path.join(__dirname, publicPath)));
app.use(subdirRoute, express.static(path.join(__dirname, publicPath)));

// 9. Routes are specified at "routes" directory
app.use(rootRoute, require(rootRouteDir));
app.use(subdirRoute, require(subdirRouteDir));
app.use(apiEmployeesRoute, require(apiEmployeeRouteDir));


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

// 5. LAST RESORT: For all request methods that doesn't find resources (404 code).
app.all('*', (req, res) => {
    res.status(NOT_FOUND_HTTP_STATUS);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, viewsPath, notFoundBasename));
    } else if (req.accepts('json')) {
        res.json({error: notFoundMsg});
    } else {
        res.type('txt').send(notFoundMsg);
    }
});


// 8. ExpressJS has its own middleware to treat exception
app.use(expressJsErrorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
