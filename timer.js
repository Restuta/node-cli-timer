import chalk from 'chalk';

console.log(chalk.red('bla'));

var interval = setInterval(everySecond, 1000);


function everySecond() {
  console.log({...arguments});
}
