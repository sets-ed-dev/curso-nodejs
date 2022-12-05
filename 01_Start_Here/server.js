const os = require('os');
const path = require('path');
const math1 = require('./math1');
const math2 = require('./math2');

console.log("Hello World!");

console.log(math1.add(5, 3));
console.log(math1.substract(5, 3));
console.log(math1.multiply(5, 3));
console.log(math1.divide(5, 3));

console.log(math2.add(5, 3));
console.log(math2.substract(5, 3));
console.log(math2.multiply(5, 3));
console.log(math2.divide(5, 3));

console.log(os.type());
console.log(os.release());
console.log(os.homedir());
console.log(__dirname);
console.log(__filename);
console.log(path.dirname(__filename));
console.log(path.basename(__filename));
console.log(path.extname(__filename));
