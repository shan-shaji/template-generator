import fs from 'fs';
import chalk from 'chalk';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const access = promisify(fs.access);
const copy = promisify(ncp);

const copyTemplateFiles = async (options) => {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  });
};

export const createProject = async (options) => {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(fileURLToPath(import.meta.url));

  const currentFileUrl = __dirname;

  console.log(currentFileUrl);

  const templateDir = path.resolve(
    currentFileUrl,
    `..`,
    'templates',
    options.template.toLowerCase()
  );

  console.log(templateDir);
  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error(err);
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  console.log('Copy project files');
  await copyTemplateFiles(options);

  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
};