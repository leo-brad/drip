export default function contentReducer(state = { index: {}, contents: [], }, action) {
  let ans = state;
  if (action.type === 'content/update') {
    const { instance, field, string, } = action;
    const { contents, index, } = state;
    if (index[instance] === undefined) {
      index[instance] = contents.length;
    }
    const i = index[instance];
    if (!Array.isArray(contents[i])) {
      contents[i] = [];
    }
    contents[i].push({ instance, field, string, });
    ans = {
      index: index,
      contents: contents,
    };
  }
  return ans;
}
