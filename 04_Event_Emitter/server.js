const EventEmitter = require('events');
const logEvents = require('./logEvents');

class AppEmitter extends EventEmitter {}

const appEmmiter = new AppEmitter();
const logEventStr = 'log';
const time = 2000;

appEmmiter.on(logEventStr, (msg) => logEvents(msg));

setInterval(() => appEmmiter.emit(logEventStr, 'Fire up!'), time);
