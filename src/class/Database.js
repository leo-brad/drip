import { fromInt, } from '~/lib/byteArray';
import Table from '~/class/Table';
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


  selectTable(name) {
    const { dbPath, } = this;
    return new Table({ dbPath, name, });
  }
}

export default Database;
