import path from 'path';
import fs from 'fs';
import Proc from '~/class/Proc';
import getPkgNames from '~/lib/getPkgNames';

class Instance {
  constructor(config, emitter) {
    const {
      packages=[],
    } = config;
    this.emitter = emitter;
    this.packages = getPkgNames(packages);
  }

  getPriProcs() {
    return this.iteratorInstance();
  }

  iteratorInstance() {
    const ans = [];
    const { packages, emitter, } = this;
    const lip = path.resolve('.drip/local/instance');
    const pip = path.resolve('.drip/project/instance');
    const hash = {};
    const instances = [];
    if (fs.existsSync(pip)) {
      const p = 'project';
      fs.readdirSync(pip, {
        withFileTyps: true,
      }).forEach((i) => {
        hash[i] = { p, i, };
      });
    }
    if (fs.existsSync(lip)) {
      const p = 'local';
      fs.readdirSync(lip, {
        withFileTyps: true,
      }).forEach((i) => {
        hash[i] = { p, i, };
      });
    }
    Object.keys(hash).forEach((k) => {
      instances.push(hash[k]);
    });
    instances.forEach(({ p, i, }) => {
      const regexp = /^\[(\w+)\]:(\w+)$/;
      if (regexp.test(i)) {
        const [_, pkg] = i.match(regexp);
        const fp = path.resolve(path.join('.drip', p, 'instance'));
        const config = fs.readFileSync(fs.openSync(path.join(fp, i), 'r')).toString();
        if (config.length !== 0 && packages.includes(pkg)) {
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
    return ans;
  }
}

export default Instance;
