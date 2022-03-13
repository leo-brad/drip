import ConfigExec from '~/class/ConfigExec';

const [_1, _2, configString, projectPath] = process.argv;
const config = JSON.parse(configString);
new ConfigExec({ config, projectPath, }).start();
