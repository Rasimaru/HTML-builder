const path = require('path');
const fsPromises = require('fs').promises;
const fs = require('fs');

const bundlePath = path.resolve(__dirname, 'project-dist', 'bundle.css');
const srcStyle = path.resolve(__dirname, 'styles');

async function collectStyles(src, dist) {
  try {
    const bundle = fs.createWriteStream(dist, 'utf-8');

    const files = await fsPromises.readdir(src, { withFileTypes: true });
    for (const file of files) {
      const fileType = file.name.split('.')[1];
      const filePath = path.resolve(src, file.name);
      if (file.isFile() && fileType === 'css') {
        const data = fs.createReadStream(filePath);
        data.on('data', (data) => {
          bundle.write(data);
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
}
collectStyles(srcStyle, bundlePath);

//==================== Merge For test files =============================

// const testDist = path.resolve(__dirname, 'test-files', 'bundle.css');
// const testStylesSrc = path.resolve(__dirname, 'test-files', 'styles');
// collectStyles(testStylesSrc, testDist);
