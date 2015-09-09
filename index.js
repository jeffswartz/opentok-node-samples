var express = require('express'),
    OpenTok = require('opentok');

var apiKey = process.env.API_KEY,
    apiSecret = process.env.API_SECRET;

if (!apiKey || !apiSecret) {
  console.log('You must specify API_KEY and API_SECRET environment variables');
  process.exit(1);
}

var app = express();
app.use(express.static(__dirname + '/public'));

var opentok = new OpenTok(apiKey, apiSecret);

opentok.createSession(function(err, session) {
  if (err) throw err;
  app.set('sessionId', session.sessionId);
  init();
});

app.get('/', function(req, res) {
  var sessionId = app.get('sessionId'),
      token = opentok.generateToken(sessionId);

  res.render('index.ejs', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token
  });
});

function init() {
  app.listen(5000, function() {
    console.log('You\'re app is now ready at http://localhost:5000/');
  });
}