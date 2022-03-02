import Database from '~/class/Database';

const db = new Database({ dbPath: '/tmp/db/', });
db.createTable('tb', [['i', 3], ['s', 5],]);
const tb = db.selectTable('tb');
tb.insert([423, 'Paul']);
console.log(tb.select(0));
tb.insert([434, 'Yuri']);
console.log(tb.select(1));
