class ContentHash {
  constructor({ content='', size=256, long=5, start, end, }) {
    this.content = content;
    this.size = size;
    this.long = long;
    this.groups = [];
    this.initRange();
  }

  initRange() {
    const { content, start, end, } = this;
    if (start) {
      this.start = 0;
    }
    if (end) {
      this.end = Math.ceil(content.length / 6) * 6;
    }
  }

  checkOverflow() {
    const { size, long, } = this;
    let r = 0;
    for (let i = 1; i <= long; i += 1) {
      r += size ** i;
    }
    if (r <= Number.MAX_SAFE_INTEGER) {
      return true;
    } else {
      return false;
    }
  }

  getHash() {
    const { content, size, long, groups, start, end, } = this;
    let group = 0;
    for (let i = start; i < end; i += 1) {
      const s = i % long;
      let charCode = content.charCodeAt(i);
      if (charCode === NaN) {
        charCode = 0;
      }
      group += charCode * size ** s;
      if (s === long - 1) {
        groups.push(group);
        group = 0;
      }
    }
    return groups.map((g) => String.fromCharCode(g % (2 ** 16))).join('');
  }
}

export default ContentHash;
