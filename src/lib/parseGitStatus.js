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
          if (char !== ' ' && char !== '\t' && char !== '\n') {
            this.start = i;
            this.code = 1;
          }
          break;
        case 1:
          if (char === ' ' || char === '\n' || char === '\t') {
            const { start, names, } = this;
            const name = status.substring(start, i);
            switch (name) {
              case 'new':
              case 'deleted:':
              case 'modified:':
              case 'Untracked':
              case 'Changes':
                return;
            }
            if (name === '') {
              return;
            }
            names.push(name);
            this.start = i + 1;
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
    this.code = 0;
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
      const { titleLexers, } = this;
      for (let i = 0; i < titleLexers; i += 1) {
        if (titleLexers[i] === this) {
          this.titleLexers.splice(i, 1);
          break;
        }
      }
    }
    return code;
  }
}

export default function parseGitStatus(status) {
  let titleLexers = [];
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
          for (let i = 0; i < titleLexers.length; i += 1) {
            const tl = titleLexers[i];
            if (tl.scan(char) === 1) {
              title = tl.template;
              type = 1;
              titleLexers = [];
              break;
            }
          }
        }
        break;
      }
      case 1: {
        const nameParser = new NameParser(status, i);
        nameParser.parse();
        if (ans[title] === undefined) {
          ans[title] = [];
        }
        ans[title] = ans[title].concat(nameParser.getNames());
        i = nameParser.getLast();
        title = '';
        type = 0;
      }
    }
  }
  return ans;
}
