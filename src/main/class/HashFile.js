import fs from 'fs';
import path from 'path';
import Database from '~/main/class/Database';
import ContentHash from '~/main/class/ContentHash';
import { fromInt, toInt, } from '~/main/lib/byteArray';

function iteratorLastId(idxPath, c) {
  return fs.readdirSync(idxPath).every((n) => {
    return c !== fs.readFileSync(path.join(idxPath, n)).toString();
  });
}

function getHashTable(l) {
  const h = {};
  l.forEach((e) => {
    h[e] = true;
  });
}

class HashFile {
  constructor({ l=2, }) {
    this.h = {};
    this.l = l;
    this.dbPath = path.join('.drip', 'local', 'db');
    this.iiPath = path.join('.drip', 'local', 'ii');
    this.perpare();
  }

  updateIndex(tb, name, idx) {
    const { h, } = this;
    const l = tb.selectAll();
    if (h[name] === undefined) {
      h[name] = getHashTable(l);
    }
    if (!h[name][idx]) {
      tb.insert([idx]);
    }
  }

  getPart() {
    const { l, } = this;
    return 12 * 6 * l;
  }

  indexFile(location) {
    const { l, } = this;
    const i = [];
    let c = fs.readFileSync(location);
    const p = c.substring(0, this.getPart());
    for (let j = 1; j < l; j += 1) {
      i.unshift(c);
      c = new HashContent({ content: c, }).getHash();
    }
    let n;
    i.forEach((k, x) => {
      n = this.perpareNextLevel(n, k, x + 1);
    });
    this.perpareInstanceIndex(n, c);
  }

  perpareInstanceIndex(n, c) {
    const { iiPath, } = this;
    const idxPath = path.join(iiPath, n);
    const totalPath = path.join(idxPath, 't');
    if (!fs.exists(idxPath)) {
      fs.mkdirSync(idxPath);
      fs.writeFileSync(totalPath, fromInt(0));
    } else {
      if (iteratorLastId(idxPath, c)) {
        if (!fs.exists(totalPath)) {
          total = toInt(fs.readFileSync(totalPath)) + 1;
          fs.writeFileSync(totalPath, fromInt(total));
          fs.writeFileSync(path.join(idxPath, total), c);
        }
      }
    }
  }

  perpareNextLevel(n, c, level) {
    const { db, l, } = this;
    let ans;
    if (level === 1) {
      const tb = db.selectTable('fi');
      updateIndex(tb, n, c);
      ans = tb;
    } else {
      this.perpareTable(n);
      const tb = db.selectTable(n);
      updateIndex(tb, n, c);
      ans = tb;
    }
    return ans;
  }

  perpare() {
    this.perpareDb();
    this.perpareTable('fi');
  }

  perpareDb() {
    const { dbPath, } = this;
    this.db = new Database({ dbPath, });
  }

  perpareTable(name, size) {
    const { db, } = this;
    if (!db.checkTable(name)) {
      db.dropTable(name);
      db.createTable(name, ['s', size]);
    }
  }
}

export default HashFile;
