const allowedOrigins = require('./allowedOrigins')


const OK_HTTP_STATUS = 200;


const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Sorry, resource bloked by CORS!'));
        }
    },
    optionsSuccessStatus: OK_HTTP_STATUS
}


module.exports = corsOptions;
