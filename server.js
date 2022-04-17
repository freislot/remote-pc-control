const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const win = require('win-audio');
const { exec } = require("child_process");
const robot = require("robotjs");

const app = express();
const speaker = win.speaker;
let timer;
let isTimerActive = false;

function setTimer(sec) {
  timer = sec
  setInterval(function () {
    timer = timer - 1
  }, 1000)
}

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

app.get('/get', function (req, res) {
  res.send({
    value: speaker.get(),
    isTimerActive: isTimerActive,
    timeToOff: timer
  });
});

app.post('/set', function (req, res) {
  speaker.set(Number(req.body.value));
  res.sendStatus(200);
});

app.post('/right', function (req, res) {
  robot.keyTap("right");
  console.log('right');
  res.sendStatus(200);
});

app.post('/left', function (req, res) {
  robot.keyTap("left");
  console.log('left');
  res.sendStatus(200);
});

app.post('/up', (req, res) => {
  speaker.increase(2);
  res.send({ value: speaker.get() });

});

app.post('/down', (req, res) => {
  speaker.decrease(2);
  res.send({ value: speaker.get() });
});

app.post('/shutdown', (req, res) => {

  exec(`shutdown -s -t ${req.body.value}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    isTimerActive = true;
    setTimer(req.body.value);
    console.log(`stdout: ${stdout}`);
  });
  res.sendStatus(200);
});

app.post('/mousemove', (req, res) => {
  const x = req.body.x;
  const y = req.body.y;
  robot.moveMouse(x, y);
  res.sendStatus(200);
});

app.post('/tap', (req, res) => {
  robot.mouseClick();
  res.sendStatus(200);
});

app.post('/shutdownOff', (req, res) => {

  exec(`shutdown -a`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    isTimerActive = false
    console.log(`stdout: ${stdout}`);
  });
  res.sendStatus(200);
});

app.post('/toggle', (req, res) => {
  speaker.toggle();
  res.send({
    value: speaker.get(),
    isMuted: speaker.isMuted()
  });
});

app.listen(3000, function () {
  console.log('Express listening on port 3000!');
});

speaker.polling(200);

speaker.events.on('change', (volume) => {
  console.log("old %d%% -> new %d%%", volume.old, volume.new);
});

speaker.events.on('toggle', (status) => {
  console.log("muted: %s -> %s", status.old, status.new);
});
