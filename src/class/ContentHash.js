class ContentHash {
  constructor({ size=256, long=6, } = {}) {
    this.size = size;
    this.long = long;
  }

  checkOverflow() {
    const { size, long, } = this;
    let r = 1;
    for (let i = 1; i <= long; i += 1) {
      r += size ** i;
    }
    if (r <= Number.MAX_SAFE_INTEGER + 32) {
      return true;
    } else {
      return false;
    }
  }

  getHash(content) {
    const { size, long, } = this;
    const groups = [];
    let group = 0;
    for (let i = 0; i < content.length; i += 1) {
      const s = i % long;
      const charCode = content.charCodeAt(i);
      group += charCode * size ** s;
      if (s === long - 1) {
        groups.push(group);
        group = 0;
      }
    }
    return groups.map((g) => String.fromCharCode(g % (2 ** 16) + 32)).join('');
  }
}

export default ContentHash;
