import path from 'path';
import fs from 'fs';
import Proc from '~/class/Proc';

class Instance {
  constructor(config, emitter,) {
    const {
      core: {
        plugins=[],
      },
    } = config;
    this.emitter = emitter;
    this.plugins = plugins;
  }

  getPriProcs() {
    return this.iteratorInstance();
  }

  iteratorInstance() {
    const ans = [];
    const { plugins, emitter, } = this;
    const instancePath = path.normalize('.drip/local/instance');
    if (fs.existsSync(instancePath)) {
      fs.readdirSync(instancePath, {
        withFileTyps: true,
      }).forEach((i) => {
        const regexp = /^\[(\w+)\]:(\w+)$/;
        if (regexp.test(i)) {
          const [_, pkg] = i.match(regexp);
          const config = fs.readFileSync(fs.openSync(path.join(instancePath, i), 'r')).toString();
          if (plugins.includes(pkg)) {
            const proc = new Proc({
              command: 'node',
              args: [
                path.join(
                  '.drip', 'local', 'package', pkg, 'dist', 'index.js'
                ),
                config,
              ],
              instance: i,
              pattern: ['event'],
              emitter,
            });
            ans.push({ pri: Math.floor(Math.random() * 100), proc, });
          }
        }
      });
    }
    return ans;
  }
}

export default Instance;
