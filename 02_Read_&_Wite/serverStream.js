const fs = require('fs');
const path = require('path');


const loremIpsumPath = path.join(__dirname, 'myDocs', 'lorem_ipsum.txt');
const newLoremPath = loremIpsumPath.replace('lorem_ipsum.txt', 'new_lorem_ipsum.txt');

// Create stream to read chunk by chunk the file
const rs = fs.createReadStream(loremIpsumPath, 'utf-8');
// Create stream to write/create a new file from read stream
const ws = fs.createWriteStream(newLoremPath, 'utf-8');

// 2 ALTERNATIVES TO 'COPY' CONTENTS OF FILE USING STREAMS:
//  1. Through listener.
//  2. By async function called pipe.

// 1.
// rs.on('data', chunk => {
//     ws.write(chunk);
// })

// 2.
rs.pipe(ws);
