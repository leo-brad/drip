export default function contentCompare(content1, content2) {
  const ans = [];
  let cmps = [];
  let start = 0;
  let eq = true;
  let idx = 0;
  while (true) {
    const c1 = content1.charAt(idx);
    const c2 = content2.charAt(idx);
    if (c1 === '' && c2 === '') {
      break;
    }
    if (eq) {
      if (c1 !== c2) {
        start = idx;
        cmps.push(c2);
        eq = false;
      }
    } else {
      if (c1 === c2) {
        ans.push([start, cmps.join('')]);
        cmps = [];
        eq = true;
      } else {
        cmps.push(c2);
      }
    }
    idx += 1;
  }
  if (cmps.length > 0) {
    ans.push([start, cmps.join('')]);
  }
  return ans;
}
