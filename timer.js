import chalk from 'chalk';
import {stdout as logLine} from 'single-line-log'; //stands for "single log"
import clearConsole from 'clear';
import moment from 'moment';
import {} from 'moment-duration-format';
import notifier from 'node-notifier';
import nanybar from 'nanybar';
import minimist from 'minimist';
const argv = (minimist(process.argv.slice(2)));

let initialTimeInMins = 45;

if (Array.isArray(argv._) && Number.isInteger(argv._[0])) {
  initialTimeInMins = argv._[0];
}

//percent vs color, read as "0-25%, 25%-50%, etc"
const nanybarProgressMap = {
  0:    'purple',
  0.25: 'purple',
  0.50: 'blue',
  0.75: 'yellow',
  0.90: 'orange',
  1:    'green'
}

let timeLeft = moment.duration(initialTimeInMins, 'minutes');
//let timeLeft = moment.duration(initialTimeInMins - 40, 'seconds');
const initialSeconds = timeLeft.asSeconds();
clearConsole();

var interval = setInterval(() => {
  if (timeLeft.asSeconds() < 0) {
    clearInterval(interval);
    onDone();
  } else {
    onEveryTick(timeLeft, initialSeconds);
    timeLeft.subtract(1, 'second');
  }
}, 1000);


function onEveryTick(secondsLeft, initialSeconds) {
  var formattedSecondsLeft = secondsLeft.format('hh:mm:ss');

  if (secondsLeft.asSeconds() === 0) {
    logLine(chalk.green('Done!') + '\n'
      + formattedSecondsLeft + '\n'
    );
  } else {
    logLine(chalk.yellow('Up and counting...') + '\n'
      + formattedSecondsLeft + '\n'
    );

    //update nanybar status based on persentage of time passed
    const nearest = toNearestDown({
      arrayOfNearest: [0, 0.25, 0.5, 0.75, 0.95, 1],
      number: getPercentOfTimePassed({
        initialSeconds: initialSeconds,
        secondsLeft: timeLeft.asSeconds()
      })
    });

    nanybar(nanybarProgressMap[nearest] + ' ' + formattedSecondsLeft);
  }
}

function getPercentOfTimePassed({initialSeconds, secondsLeft}) {
  const secondsPassed = initialSeconds - secondsLeft;
  return Number((secondsPassed / initialSeconds).toFixed(2));
}

/* gets a number and returns it's nearest neighbor from given array
e.g.  ([0.25, 0.5, 0,75], 0.3) => 0.25
      ([0.25, 0.5, 0,75], 0.51) => 0.5
      ([0.25, 0.5, 0,75], 0.74) => 0.5
*/
function toNearestDown({arrayOfNearest = [], number = 0}) {
  const nearest = arrayOfNearest.reduce((prev, curr, index, array) => {
    //if number is between prev and current - this is our interval, return lower value
    if (prev <= number && number < curr) {
      return prev;
    }
    return curr;
  });

  return nearest;
}

notifier.on('timeout', function (notifierObject, options) {
  //nanybar('exclamation');
});

notifier.on('click', function (notifierObject, options) {
  exitApp();
})

function onDone() {

  notifier.notify({
    title: 'Timer',
    message: 'Done!',
    sound: 'Glass',
    wait: true
  });

  function getRandomEmoji() {
    const emojis = [ '🐌','🐍','🐎','🐑','🐒','🐔','🐗','🐘','🐙','🐛','🐜','🐝','🐞','🐟','🐠','🐡','🐢','🐥','🐧','🐨',
      '🐩','🐫','🐬','🐭','🐮','🐯','🐰','🐱','🐲','🐳','🐴','🐵','🐶','🐷','🐸','🐹','🐺','🐻','🐼', '🦁', '🦄', '🐇'];
    const randomIndex = Math.floor(Math.random() * emojis.length);

    return emojis[randomIndex]
  }

  //blink nanybar to drive attention
  let blinkFlag = 0;
  //yes we want you to notice that timer is done
  let annoyinglyLongListOfEmoji = [getRandomEmoji()];

  setInterval(() => {
    if (blinkFlag % 5 === 0) {
      nanybar('exclamation Timer Done! ' + getRandomEmoji());
      annoyinglyLongListOfEmoji = [];
      blinkFlag++;
    } else {
      annoyinglyLongListOfEmoji.push(getRandomEmoji());
      nanybar('white Timer Done! ' + annoyinglyLongListOfEmoji.join(' '));
      blinkFlag++;
    }

  }, 1000);


  //so all notifications are safely processed if nobode reacts on a timer within 5 mins exit anyway
  setTimeout(() => {
    exitApp();
  }, 60 * 1000 * 5);
};


function exitApp(){
  nanybar('white Timer Exited 😴');


  setTimeout(() => {
    process.exit(0);
  }, 1000);
}

export default {};
