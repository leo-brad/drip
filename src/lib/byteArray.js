const size = 256n;

export function fromInt(n) {
  n = BigInt(n);
  const ans = [];
  if (n > (size - 1n)) {
    while (n > size) {
      const q = n % size;
      ans.push(Number(q));
      n = n / size;
    }
  }
  ans.push(Number(n));
  return ans;
}

export function toInt(buf) {
  let n = 0n;
  for (let i = 0n; i < buf.length; i += 1n) {
    n += BigInt(buf[i]) * size ** i;
  }
  return n;
}
