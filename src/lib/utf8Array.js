const size = 2n ** 16n;

export function fromInt(n) {
  n = BigInt(n);
  const ans = [];
  if (n > size - 34n) {
   while (n > size - 32n) {
      const q = n % (size - 32n);
      ans.push(Number(q + 32n));
      n = n / (size - 32n);
    }
  }
  ans.push(Number(n + 32n));
  return ans;
}

export function toInt(buf) {
  let n = 0n;
  for (let i = 0n; i < buf.length; i += 1n) {
    n += (BigInt(buf[i]) - 32n) * (size - 32n) ** i;
  }
  return n;
}
