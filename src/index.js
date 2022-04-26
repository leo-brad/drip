//import configExec from '~/lib/configExec';

//const [_1, _2, configString, projectPath] = process.argv;
//const config = JSON.parse(configString);
//configExec(config, projectPath);
import Serials from '~/class/Serials';

const serials = new Serials('/tmp/test/', 'test');
serials.create(['s', 'i']);
serials.addOne(['fhfsff', 1143]);
serials.addOne(['fsfsfs', 42342]);
console.log(serials.readAll());
serials.addAll([['fasdfasdfs', 423423], ['fasdfas', 43243]]);
console.log(serials.readAll());
console.log(serials.readOne());
console.log(serials.readOne());
console.log(serials.readOne());
console.log(serials.readOne());
console.log(serials.readOne());
console.log(serials.readOne());
console.log(serials.readOne());
