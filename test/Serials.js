import Serials from '~/class/Serials';

const serials = new Serials('/tmp/test/', 'test');
serials.create(['s', 'i']);
serials.add(['fhfsff', 1143]);
serials.add(['fsfsfs', 42342]);
console.log(serials.read());
