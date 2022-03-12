//import ConfigExec from '~/class/ConfigExec';

//const [_1, _2, configString, projectPath] = process.argv;
//const config = JSON.parse(configString);
//new ConfigExec({ config, projectPath, }).start();
import Serials from '~/class/Serials';

const serials = new Serials('/tmp/test/', 'test');
serials.create(['s', 'i']);
serials.add(['fsfsfs', 1312]);
serials.add(['fsfsfs', 1312]);
console.log(serials.read());
