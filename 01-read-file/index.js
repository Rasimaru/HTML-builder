const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath, 'utf8');

readStream.pipe(process.stdout);

// readStream.on('data', (chunk) => {
//   console.log(chunk);
// });
