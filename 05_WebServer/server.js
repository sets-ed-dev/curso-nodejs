const EventEmitter = require('events');
const http = require('http');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const logEvents = require('./logEvents');


class AppEmitter extends EventEmitter {}

const appEmmiter = new AppEmitter();
const logEventStr = 'log';
const time = 2000;
const PORT = process.env.PORT || 3500;
const OK_HTTP_STATUS = 200;
const INTERNAL_SERVER_ERROR_HTTP_STATUS = 500;
const MOVED_PERMANENTLY_HTTP_STATUS = 301;
const NOT_FOUND_STATUS = 404;
const rootPath = '/';
const viewsRelativeDir = 'views';
const indexBasename = 'index.html';
const notFoundBasename = '404.html';
const contentTypeHeader = 'Content-Type';
const utf8Encoding = 'utf-8';
const imageEncoding = '';

appEmmiter.on(logEventStr, (msg, fileName) => logEvents(msg, fileName));

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? utf8Encoding : imageEncoding
        );
        const data = contentType === 'application/json'
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html')
                ? NOT_FOUND_STATUS
                : OK_HTTP_STATUS,
            {contentTypeHeader: contentType}
        );
        response.end(
            contentType === 'application/json'
            ? JSON.stringify(data) : data
        );
    } catch (err) {
        appEmmiter.emit(logEventStr, `${err.name}: ${err.message}`, 'errLog.txt');
        console.log(err);
        response.statusCode = INTERNAL_SERVER_ERROR_HTTP_STATUS;
        response.end();
    }
}

// We create a http server via "manual mode".
const server = http.createServer((req, res) => {
    appEmmiter.emit(logEventStr, `${req.url}\t${req.method}`, 'reqLog.txt');
    console.log(req.url, req.method);

    // If a request to our server is coming, we check if if is root or index.
    // Some of alternatives to form a respose for that are:
    //
    // 1. IF PER REQUEST 
    // if (req.url === rootPath || req.url === indexBasename) {
    //     // We resolve this request returning 200 & index.html.
    //     const indexPath = path.join(__dirname, viewsRelativeDir, indexBasename)
    // 
    //     res.statusCode = OK_HTTP_STATUS;
    //     res.setHeader(contentTypeHeader, contentType);
    //     fs.readFile(indexPath, (err, data) => {
    //         res.end(data);
    //     });
    // }
    // 
    // // 2. SWITCH PER REQUEST
    // switch (req.url) {
    //     case rootPath:
    //         res.statusCode = OK_HTTP_STATUS;
    //         res.setHeader(contentTypeHeader, contentType);
    //         fs.readFile(indexPath, (err, data) => {
    //             res.end(data);
    //         });
    //     break;
    // }

    // Guess the content type from url.
    let contentType;
    switch(path.extname(req.url)) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.txt':
                contentType = 'text/plain';
                break;
        default:
            contentType = 'text/html';
    }

    // Guess the correct file path for answering the request
    let filePath = 
        contentType === 'text/html' && req.url === '/' 
            ? path.join(__dirname, viewsRelativeDir, indexBasename)
            : contentType === 'text/html' && req.url.slice(-1) === rootPath
                ? path.join(__dirname, viewsRelativeDir, req.url, indexBasename)
                : contentType === 'text/html'
                    ? path.join(__dirname, viewsRelativeDir, req.url)
                    : path.join(__dirname, req.url);

    // If the url hasn't established the .html in views, add it to get correct response.
    if (!path.extname(req.url) && req.url.slice(-1) !== rootPath)
        filePath += '.html';

    // Check if file exists on the server
    if (fs.existsSync(filePath)) {
        serveFile(filePath, contentType, res);
    } else {
        // 404 - 301 http status can resolve to this.
        switch(path.parse(req.url).base){
            case 'old-page.html':
                res.writeHead(
                    MOVED_PERMANENTLY_HTTP_STATUS,
                    {'Location': '/new-page.html'}
                )
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(
                    MOVED_PERMANENTLY_HTTP_STATUS,
                    {'Location': '/'}
                )
                res.end();
                break;
            default:
                serveFile(
                    path.join(__dirname, viewsRelativeDir, notFoundBasename),
                    'text/html',
                    res
                );
        }
    }
});

// Now we add a listener for our server.
server.listen(PORT, () => console.log(`Hello! Server running at port ${PORT}`));
