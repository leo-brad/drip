class Serial {
  constructor(path, name) {
    this.path = path;
    this.name = name;
  }

  initSpec() {
    const { spec, } = this;
    if (spec === undefined) {
      this.spec =
    }
  }

  createSerial() {
    const { path, name, } = this;
    const specsPath = path.join(path, name + '-s');
    fs.appendFileSync(specsPath, JSON.stringify(specs));
    const serialPath = path.join(path, name);
    fs.openSync(serialPath, 'a');
  }

  readSerail() {
  }
}

export default FileSerial;
