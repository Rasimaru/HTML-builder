const fsPromises = require('fs').promises;
const path = require('path');
const process = require('process');

async function showFiles() {
  try {
    const pathFolder = path.resolve(__dirname, 'secret-folder');
    const files = await fsPromises.readdir(pathFolder, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.resolve(pathFolder, file.name);
        const fileSize = (await fsPromises.stat(filePath)).size / 1024;
        const fileName = file.name.split('.')[0];
        const fileType = file.name.split('.')[1];
        process.stdout.write(
          `${fileName} - ${fileType} - ${fileSize.toFixed(3)}kb\n`,
        );
      }
    }
  } catch (err) {
    console.error('сламалася!');
  }
}
showFiles();
