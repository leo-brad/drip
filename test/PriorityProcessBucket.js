const priorityProcessBucket = new PriorityProcessBucket(100, 10);

priorityProcessBucket.addPriorityProcess({
  priority: 53,
  process: {
    id: 53,
  },
});
priorityProcessBucket.addPriorityProcess({
  priority: 42,
  process: {
    id: 42,
  },
});
priorityProcessBucket.addPriorityProcess({
  priority: 54,
  process: {
    id: 54,
  },
});
priorityProcessBucket.addPriorityProcess({
  priority: 20,
  process: {
    id: 20,
  },
});

console.log('result1', priorityProcessBucket.getHighestPriorityProcess());
console.log('result2', priorityProcessBucket.getHighestPriorityProcess());
console.log('result3', priorityProcessBucket.getHighestPriorityProcess());
console.log('result4', priorityProcessBucket.getHighestPriorityProcess());
