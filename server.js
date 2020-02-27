const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const win = require('win-audio');
const displaycontrol = require("display-control");

const app = express();
const speaker = win.speaker;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

app.get('/get', function (req, res) {
  res.send({ value: speaker.get() });
});

app.post('/set', function (req, res) {
  speaker.set(Number(req.body.value));
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

app.post('/toggle', (req, res) => {
  speaker.toggle();
  res.send({ 
    value: speaker.get(), 
    isMuted: speaker.isMuted()
  });
});

app.post('/displayoff', function (req, res) {
  displaycontrol.sleep();
  res.sendStatus(200);
});

app.post('/displayon', function (req, res) {
  let timerId = setInterval(() => displaycontrol.wake(), 100);
  setTimeout(() => { clearInterval(timerId); }, 10000);

  res.sendStatus(200);
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