// With brackets, imports specific functions of required package:
const { format } = require('date-fns');
// When a package has different versions inside itself, you can require it as next:
const { v4: uuid } = require('uuid');


// Before running this file, you should have installed nodemon npm package.
console.log('Connected!');

// Install date-fns package
console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'));

// Testing scripts specifid at package.json (start, dev).
console.log('Running scripts!');

// Now testing a versioned package
console.log('UUID: ', uuid());

// Upgrade packages: npm upgrade.
// Uninstalling dev dependency: npm rm <package name> <-D | -g>
//     IMPORTANT: Unistalling package doesn't remove from you package.json scripts, keep it mind!
