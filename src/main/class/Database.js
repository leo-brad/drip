import { fromInt, } from '~/main/lib/byteArray';
import Table from '~/main/class/Table';
import path from 'path';
import fs from 'fs';

class Database {
  constructor({ dbPath, }) {
    this.dbPath = dbPath;
    this.makeDirectory();
  }

  makeDirectory() {
    const { dbPath, } = this;
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath);
    }
  }

  checkTable(name) {
    const { dbPath, } = this;
    let ans = true;
    if (!fs.existsSync(path.join(dbPath, name))) {
      ans = false;
    }
    if (!fs.existsSync(path.join(dbPath, name + '-s'))) {
      ans = false;
    }
    if (!fs.existsSync(path.join(dbPath, name + '-l'))) {
      ans = false;
    }
    return ans;
  }

  createTable(name, specs) {
    const { dbPath, } = this;
    const specsPath = path.join(dbPath, name + '-s');
    fs.writeFileSync(specsPath, JSON.stringify(specs));
    const lengthPath = path.join(dbPath, name + '-l');
    let length = 0;
    specs.forEach((s) => {
      const [_, l] = s;
      length += l;
    });
    fs.writeSync(
      fs.openSync(lengthPath, 'w'),
      Buffer.from(fromInt(length)),
      0,
      fromInt(length).length,
    );
    const tablePath = path.join(dbPath, name);
    fs.openSync(tablePath, 'a');
  }

  selectTable(name) {
    const { dbPath, } = this;
    return new Table({ dbPath, name, });
  }

  dropTable(name) {
    const { dbPath, } = this;
    const tablePath = path.join(dbPath, name);
    if (fs.existsSync(tablePath)) {
      fs.rmSync(tablePath);
    }
    const specsPath = path.join(dbPath, name + '-s');
    if (fs.existsSync(specsPath)) {
      fs.rmSync(specsPath);
    }
    const lengthPath = path.join(dbPath, name + '-l');
    if (fs.existsSync(lengthPath)) {
      fs.rmSync(lengthPath);
    }
  }
}

export default Database;
