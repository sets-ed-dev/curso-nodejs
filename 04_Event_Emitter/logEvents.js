// npm modules
const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
// Built-in packages
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');


const logEvent = async (msg) => {
    const logFilename = 'eventLog.txt';
    const logDirPath = path.join(__dirname, 'logs');
    const logFilePath = path.join(logDirPath, logFilename);
    const logDatetimeFormat = 'yyyyMMdd\tHH:mm:ss';
    const datetime = format(new Date(), logDatetimeFormat);
    const id = uuid();
    
    const logItem = `${datetime}\t${id}\t${msg}\n`;
    console.log(logItem);

    try {
        if (!fs.existsSync(logDirPath)) {
            await fsPromises.mkdir(logDirPath);
        }

        await fsPromises.appendFile(logFilePath, logItem);
    } catch (err) {
        console.error(err);
    }
};

module.exports = logEvent;
