export default function contentCompare(content1, content2) {
  const ans = [];
  let cmp = [];
  let start = 0;
  let eq = true;
  let idx = 0;
  while (true) {
    const c1 = content1.charAt(idx);
    const c2 = content2.charAt(idx);
    if (c1 === '' && c2 === '') {
      break;
    }
    switch (eq) {
      case true:
        if (c1 !== c2) {
          start = idx;
          cmp.push(c2);
          eq = false;
        }
        break;
      case false:
        if (c1 === c2) {
          ans.push([start, cmp.join('')]);
          cmp = [];
          eq = true;
        } else {
          cmp.push(c2);
        }
        break;
    }
    idx += 1;
  }
  if (cmp.length > 0) {
    ans.push([start, cmp.join('')]);
  }
  return ans;
}
