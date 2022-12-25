const size = 256n;

export function fromInt(n) {
  n = BigInt(n);
  const ans = [];
  if (n > size - 2n) {
    while (n > (size - 1n)) {
      const q = n % (size - 1n);
      ans.push(Number(q + 1n));
      n = n / (size - 1n);
    }
  }
  ans.push(Number(n + 1n));
  return ans;
}

export function toInt(buf) {
  let n = 0n;
  const { length, } = buf;
  for (let i = 0n; i < buf.length; i += 1n) {
    n += (BigInt(buf[i]) - 1n) * (size - 1n) ** i;
  }
  return n;
}
