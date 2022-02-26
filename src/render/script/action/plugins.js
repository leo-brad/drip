export function updatePlugins(plugins) {
  return {
    type: 'plugins/update',
    plugins,
  };
}
