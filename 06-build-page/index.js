const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const destSrc = path.join(__dirname, 'project-dist');
const compSrc = path.join(__dirname, 'components');
const templateSrc = path.join(__dirname, 'template.html');
const components = [];

fs.mkdir(destSrc, { recursive: true }, () => {});
console.log('Directory created');
(async function replaceTemplates() {
  fs.readdir(compSrc, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const compType = file.name.split('.').slice(1).toString().trim();
      if (compType === 'html') {
        components.push(file);
      }
    });
    fs.readFile(templateSrc, { encoding: 'utf-8' }, (err, data) => {
      if (err) throw err;
      // console.log(data);
      components.forEach(async (component) => {
        const compData = await fsPromises.readFile(
          path.join(compSrc, component.name),
          {
            encoding: 'utf-8',
          },
        );
        const compName = component.name.replace('.html', '').trim();
        data = data.replace('{{' + compName + '}}', compData);
        fs.writeFile(path.join(destSrc, 'index.html'), data, () => {});
      });
    });
  });
})();

// Merge styles

const srcStyles = path.join(__dirname, 'styles');
const destStyles = path.join(__dirname, 'project-dist');
const output = fs.createWriteStream(path.join(destStyles, 'style.css'));

fs.readdir(srcStyles, { withFileTypes: true }, function (err, files) {
  if (err) throw err;
  files.forEach((file) => {
    const fileData = file.name.split('.');
    // console.log(fileData);
    // console.log(file.name);
    if (fileData[1] === 'css' && !file.isDirectory()) {
      const input = fs.createReadStream(path.join(srcStyles, file.name));
      input.on('data', (data) => output.write(`${data}\n`));
    }
  });
  console.log('styles.css created successfully');
});

//copy Assets

const srcAssets = path.join(__dirname, 'assets');
const destAssets = path.join(__dirname, 'project-dist/assets');

(async function copyFiles(srcAssets, destAssets) {
  await fs.mkdir(destAssets, { recursive: true }, () => {
    // console.log('Directory created successfully');
    fs.readdir(srcAssets, { withFileTypes: true }, function (err, files) {
      if (err) throw err;
      files.forEach(function (file) {
        if (file.isFile()) {
          fsPromises.copyFile(
            path.join(srcAssets, file.name),
            path.join(destAssets, file.name),
            fs.constants.COPYFILE_FICLONE,
          );
        }
        if (file.isDirectory()) {
          fsPromises.mkdir(path.join(destAssets, file.name), {
            recursive: true,
          });
          copyFiles(
            path.join(srcAssets, file.name),
            path.join(destAssets, file.name),
          );
        }
      });
    });
  });
})(srcAssets, destAssets);
console.log('Assets copied');
