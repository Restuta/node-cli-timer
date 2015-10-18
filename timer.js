import chalk from 'chalk';
import {stdout as logLine} from 'single-line-log'; //stands for "single log"
import moment from 'moment';
import {} from 'moment-duration-format';
import notifier from 'node-notifier';
import nanybar from 'nanybar';


let secondsLeft = moment.duration(10, 'seconds');
nanybar('yellow');


var interval = setInterval(() => {
  if (secondsLeft.asSeconds() < 0) {
    clearInterval(interval);
    onDone();
  } else {
    onEveryTick(secondsLeft);
    secondsLeft.subtract(1, 'second');
  }
}, 1000);


function onEveryTick(secondsLeft) {
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

notifier.on('timeout', function (notifierObject, options) {
  //nanybar('exclamation');
});

notifier.on('click', function (notifierObject, options) {
  process.exit(0);
})

function onDone() {
  nanybar('green');

  notifier.notify({
    title: 'Timer',
    message: 'Done!',
    sound: true,
    wait: true
  });

  //so all notifications are safely processed if nobode reacts on a timer within 5 mins exit anyway
  setTimeout(() => {
    process.exit(0);
  }, 60 * 1000 * 5);
};

export default {};
