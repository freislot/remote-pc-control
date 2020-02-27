const express = require('express');
const bodyParser = require('body-parser');
const win = require('win-audio');

const app = express();
const speaker = win.speaker;

app.use(express.static('public'));
app.use(bodyParser.json())

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