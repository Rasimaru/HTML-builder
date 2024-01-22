const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'styles');
const dest = path.join(__dirname, 'project-dist');
const output = fs.createWriteStream(path.join(dest, 'bundle.css'));

fs.readdir(src, { withFileTypes: true }, function (err, files) {
  files.forEach((file) => {
    const fileData = file.name.split('.');
    // console.log(fileData);
    // console.log(file.name);
    if (fileData[1] === 'css' && !file.isDirectory()) {
      const input = fs.createReadStream(path.join(src, file.name));
      input.on('data', (data) => output.write(`${data}\n`));
    }
  });
});
