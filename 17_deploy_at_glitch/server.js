require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { vi } = require('date-fns/locale');
const expressJsErrorHandler = require('./middleware/expressJsErrorHandler');
const verifyJwtAuth = require('./middleware/verifyJWT');
const addCredentialsHeader = require('./middleware/credentials');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const { logger } = require('./middleware/logEvents');


const app = express();
const PORT = process.env.PORT || 3500;
const publicPath = 'public';
const viewsPath = 'views';
const notFoundBasename = '404.html';
const NOT_FOUND_HTTP_STATUS = 404;
const notFoundMsg = '404 - Not Found';
const rootRoute = '/';
const rootRouteDir = './routes/root';
const apiEmployeesRoute = '/employees';
const apiEmployeesRouteDir = './routes/api/employees';
const registerRoute = '/register';
const registerRouteDir = './routes/registerUser';
const authRoute = '/auth';
const authRouteDir = './routes/authUser';
const refreshTokenRoute = '/refreshToken';
const refreshTokenRouteDir = './routes/refreshToken';
const logoutRoute = '/logout';
const logoutRouteDir = './routes/logout';
const apiUsersRoute = '/users';
const apiUsersRouteDir = './routes/api/users';


// Connect to MongoDB!
connectDB();

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

// 12. Credentials middleware to meet requirements about fetch-way of
// programming languages. This is set BEFORE CORS middleware.
app.use(addCredentialsHeader);

// 8. THIRD -PARTY MIDDLEWARE:
// Example is the CORS package, CORS = Cross Origin Resource Sharing, avoids CORS
// exceptions between different request-response origins.
app.use(cors(corsOptions));

// 6. BUILT-IN MIDDLEWARE:
// 6.1 For html form submitted data:
app.use(express.urlencoded({ extended: false }));
// 6.2 For json.
app.use(express.json());
// 6.3 For serving static files for specofied directory (default: '/').
app.use(rootRoute, express.static(path.join(__dirname, publicPath)));
// 11. Cookie parser.
app.use(cookieParser());

// 9. Routes are specified at "routes" directory.
app.use(rootRoute, require(rootRouteDir));
app.use(registerRoute, require(registerRouteDir));
app.use(authRoute, require(authRouteDir));
app.use(refreshTokenRoute, require(refreshTokenRouteDir));
app.use(logoutRoute, require(logoutRouteDir));
// 10. Using verify JWT middleware, SINCE this line all route will be verified.
app.use(verifyJwtAuth);
app.use(apiEmployeesRoute, require(apiEmployeesRouteDir));
app.use(apiUsersRoute, require(apiUsersRouteDir));


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


// Ensuring we can get connection & after that listne to our ExpressJS server.
mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
