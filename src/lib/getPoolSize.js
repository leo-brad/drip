import os from 'os';

export default function getPoolSize(config) {
  const {
    adjustCore=0,
  } = config;
  const reduceCore = 0;
  const cpusLength = os.cpus().length;
  const minSize = 2;
  let size;
  if (cpusLength <= minSize) {
    size = minSize + adjustCore - reduceCore;
  } else {
    size = cpusLength + adjustCore - reduceCore;
  }
  if (size < 1) {
    size = 1;
  }
  return size;
}
