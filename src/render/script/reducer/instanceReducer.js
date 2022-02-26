export default function instanceReducer(state = { instance: '', instances: [], }, action) {
  let ans = state;
  if (action.type === 'instance/add') {
    const { instance, } = action;
    const { instances, } = state;
    if (instances.length === 0) {
      state.instance = instance;
    }
    instances.push(instance);
    ans = { ...state, instances, };
  }
  if (action.type === 'instance/reduce') {
    const { instance, } = action;
    const { instances, } = state;
    for (let i = 0; i < instances.length; i += 1) {
      if (instance === instances[i]) {
        instances.splice(i, 1);
        break;
      }
    }
    ans = { ...state, instances, };
  }
  if (action.type === 'instance/change') {
    const { instance, } = action;
    ans = { ...state, instance, };
  }
  return ans;
}
