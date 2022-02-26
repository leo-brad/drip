export function changeInstance(instance) {
  return {
    type: 'instance/change',
    instance,
  };
}

export function addInstance(instance) {
  return {
    type: 'instance/add',
    instance,
  };
}

export function reduceInstance(instance) {
  return {
    type: 'instance/reduce',
    instance,
  };
}
