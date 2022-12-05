const fs = require('fs');
const path = require('path');

const newDirPath = path.join(__dirname, 'newMyDocs');

if (!fs.existsSync(newDirPath)) {
    fs.mkdir(newDirPath, err => {
        if (err)
            throw err;
        console.log(`${newDirPath}: created!`)
    });
}


// For Uncaught Exceptions
process.on('uncaughtException', err => {
    console.error(`There was an uncaught error:\n\n${err}`);
    process.exit(1);
});
