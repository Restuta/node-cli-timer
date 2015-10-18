import chalk from 'chalk';
import {stdout as logLine} from 'single-line-log'; //stands for "single log"
import moment from 'moment';
import {} from 'moment-duration-format';



let secondsLeft = moment.duration(10, 'seconds');


var interval = setInterval(() => {
  if (secondsLeft.asSeconds() < 0) {
    clearInterval(interval);
    process.exit(0);
  }
  runEverySecond(secondsLeft);
  secondsLeft.subtract(1, 'second');
}, 1000);


function runEverySecond(secondsLeft) {

  if (secondsLeft.asSeconds() === 0) {
    logLine(chalk.green('Done!') + '\n'
      + secondsLeft.format('mm:ss') + '\n'
    );
  } else {
    logLine(chalk.yellow('Up and counting...') + '\n'
      + secondsLeft.format('mm:ss') + '\n'
    );
  }


}
