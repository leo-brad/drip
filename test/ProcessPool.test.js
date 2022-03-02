const processPool = new ProcessPool(8);
const one = { id: 42, };
const two = { id: 58, };
const three = { id: 85, };
const four = { id: 38, };
const five = { id: 48, };
const six = { id: 19, };
const seven = { id: 29, };
const eight = { id: 58, };
const nine = { id: 38, };
const ten = { id: 68, };
const eleven = { id: 39, };
const twelve = { id: 59, };
const thirteen = { id: 39, };
const fourteen = { id: 95, };
const fifteen= { id: 39, };
processPool.addPriorityProcess(42, one);
processPool.addPriorityProcess(58, two);
processPool.addPriorityProcess(85, three);
processPool.addPriorityProcess(38, four);
processPool.addPriorityProcess(48, five);
processPool.addPriorityProcess(19, six);
processPool.addPriorityProcess(29, seven);
processPool.addPriorityProcess(58, eight);
processPool.addPriorityProcess(38, nine);
processPool.addPriorityProcess(68, ten);
processPool.addPriorityProcess(39, eleven);
processPool.addPriorityProcess(59, twelve);
processPool.addPriorityProcess(39, thirteen);
processPool.addPriorityProcess(95, fourteen);
processPool.addPriorityProcess(39, fifteen);

processPool.updatePool();
processPool.getPool();

processPool.removeProcess(fourteen);
processPool.removeProcess(three);

processPool.updatePool();
console.log('diff', processPool.getDiff());
console.log('pool', processPool.getPool());

processPool.removeProcess(ten);
processPool.removeProcess(twelve);

processPool.updatePool();
console.log('diff', processPool.getDiff());
console.log('pool', processPool.getPool());
