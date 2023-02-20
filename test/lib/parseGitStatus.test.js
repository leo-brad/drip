import { describe, expect, test, } from '@jest/globals';
import parseGitStatus from '~/lib/parseGitStatus';

describe('[lib] parseGitStatus', () => {
  test('Git status output should be parsed correct.', () => {
    const output = 'On branch master\nChanges not staged for commit:\n  (use "git add/rm <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)\n\tdeleted:    some\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n\ttxt\n\nno changes added to commit (use "git add" and/or "git commit -a")\n';
    expect(JSON.stringify(parseGitStatus(output))).toMatch('{\"deleted:\":[\"some\"]}');
  });
});
