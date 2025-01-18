const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');

const outputFile = fs.createWriteStream(path.resolve(__dirname, 'output.txt'), {
  encoding: 'utf-8',
  highWaterMark: 1,
});

stdout.write('Hello there!\n');

stdin.on('data', (data) => {
  let inputString = data.toString().trim();
  if (inputString !== 'exit') {
    outputFile.write(`${inputString}\n`);
    stdout.write(
      'Text saved. You can write more or type "exit" or use ctrl + C to quit:\n',
    );
  } else {
    endInput();
  }
});

function endInput() {
  outputFile.end(() => {
    stdout.write('May the force be with you!');
    process.exit();
  });
}

process.on('SIGINT', () => endInput());
