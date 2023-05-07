import path from 'path';
import fs from 'fs';

export default function getPackages() {
  const ans = [];
  const alldir = path.resolve('.drip/local/package/');
  fs.readdirSync(alldir).forEach((n) => {
    const eachdir = path.join(alldir, n);
    if (fs.lstatSync(eachdir).isDirectory()) {
      ans.push(fs.readFileSync(
        path.join(eachdir, 'render.bundle.js')
      ).toString());
    }
  });
  return ans;
}
