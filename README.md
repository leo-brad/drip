# Drip

## Quick Start

Install drip pass execute follow shell script.

```sh
curl http://drip.org.cn:3004/file/install.js -d "" | node -
```

After finished install.Execute follow commands initital current directory.

```sh
drip  init
```

Execute follow commands install configuration drip package.

```sh
drip install
```

Execute follow commands install related commands.

```sh
drip command add start
```

Start drip local pattern in drip project finally.

```sh
drip start
```

## Configuaration

In drip project directory.Each package can configuration in `.drip/local/instance/[package]:instance`
and `.drip/project/instance/[package]:instance/`.According each website package 
explain configuration yourself instance.

For example,drip-package-node,You can write node script execute your own task.For example,unit test task.Each test spec with a instance.

```sh
child_process.execSync('jest path/[name].test.js', { stdio: 'inherit', });
```

Style lint is other way for your execute your own task.

```sh
child_process.execSync('eslint ./src', { stdio: 'inherit', });
```
