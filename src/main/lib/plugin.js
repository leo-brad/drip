import path from 'path';
import fs from 'fs';

export function getPlugins() {
  const ans = [];
  const alldir = path.normalize('.drip/local/plugin/');
  fs.readdirSync(alldir).forEach((n) => {
    const eachdir = path.join(alldir, n);
    if (fs.lstatSync(eachdir).isDirectory()) {
      ans.push(fs.readFileSync(
        path.join(eachdir, 'dist', 'render.bundle.js')
      ).toString());
    }
  });
  return ans;
}
