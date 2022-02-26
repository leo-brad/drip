export default function pluginsReducer(state = { plugins: [], }, action) {
  let ans = state;
  if (action.type === 'plugins/update') {
    const plugins = {};
    action.plugins.forEach((p) => {
      new Function(p)();
      const { name, exports, } = window.module;
      plugins[name] = exports;
    });
    delete window.module;
    ans = { ...state, plugins, };
  }
  return ans;
}
