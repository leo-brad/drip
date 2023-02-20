class NameParser {
  constructor(status, i) {
    this.status = status;
    this.index = i;
    this.start = i;
    this.names = [];
    this.code = 0;
  }

  parse() {
    const { index, status, } = this;
    for (let i = index; i < status.length; i += 1) {
      const char = status[i];
      switch (this.code) {
        case 0:
          if (char !== ' ') {
            this.start = i;
            this.code = 1;
          }
          break;
        case 1:
          if (char === ' ' || char === '\n') {
            const { start, names, } = this;
            const name = status.substring(start, i);
            if (name === '\nUntracked') {
              return;
            }
            names.push(name);
            this.start = i;
            this.code = 0;
          }
          break;
      }
    }
  }

  getNames() {
    return this.names;
  }

  getLast() {
    return this.start - 1;
  }
}

class TitleLexer {
  constructor(template, titleLexers, index) {
    this.titleLexers = titleLexers;
    this.template = template;
    this.index = 0;
  }

  scan(char) {
    const { template, index, titleLexers, } = this;
    let code = 0;
    if (char === template.charAt(index)) {
      this.index += 1;
      if (index === template.length - 1) {
        code = 1;
      }
    } else {
      this.titleLexers.splice(index, 1);
    }
    return code;
  }
}

export default function parseGitStatus(status) {
  const titleLexers = [];
  const ans = {};
  let type = 0;
  let title = '';
  for (let i = 0; i < status.length; i += 1) {
    const char = status.charAt(i);
    switch (type) {
      case 0: {
        switch (char) {
          case 'n':
            titleLexers.push(
              new TitleLexer('new file:', titleLexers, titleLexers.length)
            );
            break;
          case 'd':
            titleLexers.push(
              new TitleLexer('deleted:', titleLexers, titleLexers.length)
            );
            break;
          case 'm':
            titleLexers.push(
              new TitleLexer('modified:', titleLexers, titleLexers.length)
            );
            break;
          default:
            break;
        }
        if (titleLexers.length !== 0) {
          titleLexers.forEach((tl) => {
            switch (tl.scan(char)) {
              case 1:
                title = tl.template;
                type = 1;
                break;
              default:
            }
          });
        }
        break;
      }
      case 1: {
        const nameParser = new NameParser(status, i);
        nameParser.parse();
        ans[title] = nameParser.getNames();
        i = nameParser.getLast();
        title = '';
        type = 0;
      }
    }
  }
  return ans;
}
