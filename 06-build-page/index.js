const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const distFolder = path.resolve(__dirname, 'project-dist');
const srcAssets = path.resolve(__dirname, 'assets');
const distAssets = path.resolve(distFolder, 'assets');
const srcComponents = path.resolve(__dirname, 'components');
const srcStyles = path.resolve(__dirname, 'styles');

async function arrangeFolder(dist) {
  try {
    await fsPromises.access(dist);
    await fsPromises.rm(dist, { recursive: true, force: true });
  } catch {
    /* ignoring */
  }
  await fsPromises.mkdir(dist, { recursive: true });
}

async function copyDirectory(src, dist) {
  try {
    const files = await fsPromises.readdir(src, {
      withFileTypes: true,
    });

    await arrangeFolder(dist);

    for (const file of files) {
      const srcFilePath = path.resolve(src, file.name);
      const distFilePath = path.resolve(dist, file.name);

      if (file.isDirectory()) {
        await copyDirectory(srcFilePath, distFilePath);
      } else if (file.isFile()) {
        await fsPromises.copyFile(srcFilePath, distFilePath);
      }
    }
  } catch (error) {
    console.log('Assets are not generated');
    console.error(error);
  }
}

async function collectStyles() {
  try {
    const bundle = fs.createWriteStream(
      path.resolve(distFolder, 'style.css'),
      'utf-8',
    );
    const files = await fsPromises.readdir(srcStyles, { withFileTypes: true });

    for (const file of files) {
      const fileType = path.extname(file.name);
      const filePath = path.resolve(srcStyles, file.name);
      if (file.isFile() && fileType === '.css') {
        const data = fs.createReadStream(filePath);
        data.on('data', (data) => {
          bundle.write(data);
        });
      }
    }
    console.log('CSS-bundle is genereted');
  } catch (error) {
    console.log('CSS-bundle is not genereted');
    console.error(error);
  }
}

async function createIndex() {
  try {
    const templatePath = path.resolve(__dirname, 'template.html');
    const outputPath = path.resolve(distFolder, 'index.html');
    let template = await fsPromises.readFile(templatePath, 'utf-8');

    const components = await fsPromises.readdir(srcComponents, {
      withFileTypes: true,
    });

    for (const component of components) {
      const componentType = path.extname(component.name);
      const componentName = path.basename(component.name, componentType);

      if (component.isFile() && componentType === '.html') {
        const componentPath = path.resolve(srcComponents, component.name);
        const componentData = await fsPromises.readFile(componentPath, 'utf-8');

        template = template.replace(`{{${componentName}}}`, componentData);
      }
    }
    await fsPromises.writeFile(outputPath, template, 'utf-8');
    console.log('HTML-file is genereted');
  } catch (error) {
    console.log('CSS-bundle is not genereted');
    console.error(error);
  }
}

async function pageBuild() {
  try {
    await copyDirectory(srcAssets, distAssets);
    collectStyles();
    createIndex();
    console.log('project-dist successfully created');
  } catch (error) {
    console.log('Something went wrong');
    console.error(error);
  }
}

pageBuild();
