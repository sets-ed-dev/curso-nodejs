// npm modules
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
// Built-in packages
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');


const logEvent = async (msg, fileName) => {
    const logDirPath = path.join(__dirname, '..', 'logs');
    const logFilePath = path.join(logDirPath, fileName);
    const logDatetimeFormat = 'yyyyMMdd\tHH:mm:ss';
    const datetime = format(new Date(), logDatetimeFormat);
    const id = uuid();
    
    const logItem = `${datetime}\t${id}\t${msg}\n`;

    try {
        if (!fs.existsSync(logDirPath)) {
            await fsPromises.mkdir(logDirPath);
        }

        await fsPromises.appendFile(logFilePath, logItem);
    } catch (err) {
        console.error(err);
    }
};

const logger = (req, res, next) => {
    logEvent(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLogs.txt');
    next();
}


module.exports = {
    logEvent,
    logger
};
