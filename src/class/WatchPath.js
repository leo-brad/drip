import { execSync, } from 'child_process';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import parseGitStatus from '~/lib/parseGitStatus';

class WatchPath {
  constructor(emitter, config) {
    this.checkGitExist();
    this.emitter = emitter;
    this.config = config;
    this.events = [];
    this.started = false;
  }

  checkGitExist() {
    try {
      execSync('git status');
    } catch (e) {
      console.log([
        '',
        chalk.bold('Check git status error') + ':',
        '',
        'Drip need use `' + chalk.bold('git') + '` get file content change message.',
        '',
        chalk.bold('Useful comment') + ':',
        '',
        '  - Please use `' + chalk.bold('git init') + '` initial current project as a git project.',
        '',
      ].join('\n'));
      process.exit(0);
    }
  }

  start() {
    this.watchRename(path.resolve('.'));
    this.recurse(path.resolve('.'));
    this.updateEvents();
    this.started = true;
  }

  updateEvents() {
    const { config, } = this;
    const {
      interval=0,
    } = config;
    global.setInterval(() => {
      this.events = [];
    }, interval);
  }

  recurse(location) {
    if (fs.existsSync(location)) {
      if (fs.lstatSync(location).isDirectory()) {
        fs.readdirSync(location, {
          withFileTyps: true,
        }).forEach((n) => {
          if (!this.check(n)) {
            this.recurse(path.join(location, n));
          }
        });
      }
      if (fs.lstatSync(location).isFile(location)) {
        if (!this.check(location)) {
          this.watchChange(location);
          const { started, } = this;
          if (started) {
            execSync('git add --all');
          }
        }
      }
    }
  }

  watchRename(location) {
    const { emitter, } = this;
    fs.watch(location, { recursive: true, }, (eventType, filename) => {
      this.recurse(path.resolve(location, filename));
    });
  }

  watchChange(location) {
    const { emitter, } = this;
    fs.watch(location, (eventType, filename) => {
      if (this.checkModify()) {
        this.generateEvent(eventType, path.resolve(location));
      }
    });
  }

  checkModify() {
    const status = parseGitStatus(execSync('git status').toString());
    let ans = false;
    if (status) {
      if (Array.isArray(status['modified:']) && status['modified:'].length > 0) {
        ans = true;
      }
    }
    return ans;
  }

  generateEvent(eventType, location) {
    const { events, emitter, } = this;
    const isUnique = events.every((e) => {
      let flag = false;
      if (e.eventType !== eventType || e.location !== location) {
        return true;
      }
      return flag;
    });
    if (isUnique) {
      events.push({ eventType, location, });
      emitter.emit('file', eventType, location);
    }
  }

  check(location) {
    const { config, } = this;
    const {
      ignores=[],
    } = config;
    let ans = false;
    if (
      /^\.drip\/local\/instance\/\[(\w+)\]:(\w+)$/
      .test(path.relative('.', location))
    ) {
      return ans;
    }
    for (let i = 0; i < ignores.length; i += 1) {
      if (new RegExp('^' + ignores[i]).test(path.relative('.', location))) {
        ans = true;
        break;
      };
    }
    return ans;
  }
}

export default WatchPath;
