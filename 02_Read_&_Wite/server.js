const fs = require('fs');
const path = require('path');

var greetingFilePath = path.join(__dirname, 'myDocs', 'greetings.txt');
var replyFilePath = path.join(__dirname, 'myDocs', 'reply.txt');
var newReplyFilePath = path.join(__dirname, 'myDocs', 'newReply.txt');
var strToWrite = 'See you later, pal!\n\n';

// Read a file.
fs.readFile(greetingFilePath, 'utf-8', (err, data) => {
    if (err)
        throw err;
    else
        console.log(data);
});

// Write on a file.
fs.writeFile(replyFilePath, strToWrite, (err, data) => {
    if (err)
        throw err;
    else
        console.log('Write string to reply.txt: ready!');
});

// Callback hell time!
fs.writeFile(replyFilePath, strToWrite, (err) => {
    if (err)
        throw err;
    else {
        fs.appendFile(replyFilePath, strToWrite, (err) => {
            if (err)
                throw err;
            else {
                fs.rename(replyFilePath, newReplyFilePath, (err) => {
                    if (err)
                        throw err;
                    else
                        console.log('File process ready!');
                });
            }
        });
    }
});


// For Uncaught Exceptions
process.on('uncaughtException', err => {
    console.error(`There was an uncaught error:\n\n${err}`);
    process.exit(1);
});
