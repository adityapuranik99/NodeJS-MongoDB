const fs = require('fs');

setTimeout(() => {
  console.log('Timer 1 Expired!');
}, 0);

setImmediate(() => console.log('Immediate 1 finished!'));

fs.readFileSync();
