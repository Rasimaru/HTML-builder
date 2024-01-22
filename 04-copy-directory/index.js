const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const src = path.join(__dirname, 'files/');
const dest = path.join(__dirname, 'files-copy');

fs.mkdir(dest, { recursive: true }, () => {
  console.log('Directory created successfully');
  fs.readdir(src, { withFileTypes: true }, function (err, files) {
    files.forEach(function (file) {
      fsPromises.copyFile(
        path.join(src, file.name),
        path.join(dest, file.name),
        fs.constants.COPYFILE_FICLONE,
      );
    });
  });
  console.log('Files copied');
});
