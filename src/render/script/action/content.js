export function updateContent({ instance, field, string, }) {
  return {
    type: 'content/update',
    field,
    instance,
    string,
  };
}
