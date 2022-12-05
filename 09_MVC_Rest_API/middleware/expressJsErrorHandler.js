const { logEvent } = require('./logEvents');


const expressJsErrorHandler = (err, req, res, next) => {
    const msg = `${err.name}: ${err.message}`;
    const logName = 'errLog.txt';
    const INTERNAL_SERVER_ERROR_HTTP_STATUS = 500;

    logEvent(msg, logName);
    console.error('UPS!\n', err.stack);
    res.status(INTERNAL_SERVER_ERROR_HTTP_STATUS).send(err.message);
}

module.exports = expressJsErrorHandler;
