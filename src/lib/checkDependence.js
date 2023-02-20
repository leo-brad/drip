import { exec, } from 'child_process';
import os from 'os';
import chalk from 'chalk';

function showCommandTip(command, d) {
  return  ' Use `' + chalk.bold(command + ' ' + d) + '` install related dependence.';
}

function showPlatformTip(d) {
  switch (os.platform()) {
    case 'darwin':
      console.log(' - ' + showCommandTip('brew install', d));
      break;
    case 'freebsd':
      console.log(' - ' + showCommandTip('pkg install', d));
      break;
    case 'linux':
      console.log([
        '  - ' + chalk.bold('Gentoo') + ':',
        '',
        '  ' + showCommandTip('emerge --ask', d),
        '',
        '  - ' + chalk.bold('Archlinux') + ':',
        '',
        '  - ' + chalk.bold('Ubuntu') + ':',
        '',
        '  ' + showCommandTip('pacman -S', d),
      ].join('\n'));
      break;
    case 'openbsd':
    case 'sunos':
    case 'win32':
      console.log('Search command line program download and install.');
    default:
      break;
  }
}

function showError(dependence, number) {
  console.log([
    '',
    chalk.bold('Dependence check error number ') + '[' + chalk.bold(number) + ']' + ':',
    '',
    'Command line program `' + chalk.bold(dependence) + '` don\'t be installed.',
    '',
    chalk.bold('Prossible help') + ':',
    '',
  ].join('\n'));
  showPlatformTip(dependence);
  console.log('');
}

export default async function checkDependence(dependencies) {
  let err = 0;
  for (let i = 0; i < dependencies.length; i += 1) {
    const d = dependencies[i];
    await new Promise((resolve, reject) => {
      exec(d + ' || ' + d + ' --help', (error) => {
        if (error !== null) {
          err += 1;
          showError(d, err);
          resolve();
        }
      });
    });
  }
  if (err > 0) {
    process.exit(0);
  }
}
