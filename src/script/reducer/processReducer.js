export default function processReducer(state = { id: 1, }, action) {
  switch (action.type) {
    case 'process/change':
      return { id: action.id, };
    default:
      return state;
  }
}
