const fsPromises = require('fs').promises;
const path = require('path');

const processMsg = async () => {
    try {
        const greetingsPath = path.join(__dirname, 'myDocs', 'greetings.txt');
        const msg1Path = path.join(__dirname, 'myDocs', 'msg1.txt');
        const reply1Path = path.join(__dirname, 'myDocs', 'msgReply1.txt');

        const strMsg = await fsPromises.readFile(greetingsPath, 'utf-8');

        if (strMsg) {
            console.log('Greetings content: ', strMsg);

            // Write / Create a file
            await fsPromises.writeFile(msg1Path, strMsg);
            
            // Append new string line to file
            await fsPromises.appendFile(msg1Path, '\nYeah!');

            // Rename a file
            await fsPromises.rename(msg1Path, reply1Path);

            console.log('Process completed.');
        }
    } catch (err) {
        console.error(err);
    }
}

processMsg();
