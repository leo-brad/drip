export default function getPkgNames(packages) {
  return packages.map((p) => {
    const r = /^\[(\w+)\]\(([\w\-\/\.]+)\)$/;
    if (r.test(p)) {
      const [_, pkg] = p.match(r);
      return pkg;
    }
  });
}
