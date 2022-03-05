import path from 'path';
import fs from 'fs';

class WatchPath {
  constructor({ emitter, config={}, }) {
    this.emitter = emitter;
    this.config = config;
    this.events = [];
  }

  start() {
    this.watchNew(path.resolve('.'));
    this.recurse(path.resolve('.'));
    this.updateEvents();
  }

  updateEvents() {
    const { config, } = this;
    const {
      core: {
        interval=0,
      }
    } = config;
    global.setInterval(() => {
      this.events = [];
    }, interval);
  }

  recurse(location) {
    if (fs.lstatSync(location).isDirectory()) {
      fs.readdirSync(location, {
        withFileTyps: true,
      }).forEach((n) => {
        if (!this.check(location)) {
          this.recurse(path.join(location, n));
        }
      });
    }
    if (fs.lstatSync(location).isFile(location)) {
      if (!this.check(location)) {
        this.watchRenameAndChange(location);
      }
    }
  }

  watchNew(location) {
    const { emitter, } = this;
    fs.watch(location, { recursive: true, }, (eventType) => {
      if (eventType === 'rename') {
        this.recurse(path.normalize('.'));
      }
    });
  }

  watchRenameAndChange(location) {
    const { emitter, } = this;
    fs.watch(location, (eventType, filename) => {
      this.generateEvent(eventType, path.resolve(location));
    });
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
      core: {
        ignores=[],
      }
    } = config;
    let ans = false;
    if (
      /^\/.drip\/local\/instance\/\[(\w+)\]:(\w+)$/
      .test(path.resolve(location))
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
