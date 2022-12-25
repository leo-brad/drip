import configExec from '~/lib/configExec';

const [_1, _2, configString, projectPath] = process.argv;
const config = JSON.parse(configString);
configExec(config, projectPath);
