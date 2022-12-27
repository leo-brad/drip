import os from 'os';

export default function getPoolSize(config) {
  const {
    adjustCore=0,
  } = config;
  const cpusLength = os.cpus().length;
  const minSize = 2;
  let size;
  if (cpusLength <= minSize) {
    size = minSize + adjustCore - 2;
  } else {
    size = cpusLength + adjustCore - 2;
  }
  if (size < 1) {
    size = 1;
  }
  return size;
}
