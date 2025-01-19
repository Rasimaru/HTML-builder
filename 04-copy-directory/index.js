const path = require('path');
const fsPromises = require('fs').promises;

const sourcePath = path.resolve(__dirname, 'files');
const distPath = path.resolve(__dirname, 'files-copy');

async function arrangeFolder(dist) {
  try {
    await fsPromises.access(dist);
    await fsPromises.rm(dist, { recursive: true, force: true });
  } catch {
    /* ignoring */
  }
  await fsPromises.mkdir(dist, { recursive: true });
}

async function copyFolder(src, dist) {
  try {
    const files = await fsPromises.readdir(src, {
      withFileTypes: true,
    });

    await arrangeFolder(dist);

    for (const file of files) {
      const srcFilePath = path.resolve(src, file.name);
      const distFilePath = path.resolve(dist, file.name);

      if (file.isDirectory()) {
        await copyFolder(srcFilePath, distFilePath);
      } else if (file.isFile()) {
        await fsPromises.copyFile(srcFilePath, distFilePath);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

copyFolder(sourcePath, distPath);
