const { stdin, stdout, exit } = require('process');
const fs = require('fs');
const path = require('path');

stdout.write('Greetings, fellow!\n');
const output = fs.createWriteStream(path.join(__dirname, 'output.txt'));
stdin.on('data', (data) => {
  let text = data.toString().trim();
  if (text.toLowerCase() !== 'exit') {
    output.write(`${text}\n`);
  } else {
    stdout.write('Goodbuy, fellow!\n');
    exit();
  }
});

process.on('SIGINT', () => {
  stdout.write('Goodbuy, fellow!\n');
  exit();
});
