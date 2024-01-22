const fs = require('fs');
const path = require('path');
const secretFolder = path.join(__dirname, '/secret-folder');

fs.readdir(secretFolder, { withFileTypes: true }, function (err, files) {
  files.forEach(function (file) {
    fs.stat(path.join(secretFolder, file.name), (err, stats) => {
      if (!stats.isDirectory()) {
        const fileData = file.name.split('.');
        fileData.push((stats.size / 1024).toFixed(2) + 'kb');
        console.log(`${fileData[0]} - ${fileData[1]} - ${fileData[2]}`);
      }
    });
  });
});
