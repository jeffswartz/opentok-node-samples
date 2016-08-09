var express = require('express'),
    OpenTok = require('opentok');

var apiKey = process.env.API_KEY,
    apiSecret = process.env.API_SECRET;

if (!apiKey || !apiSecret) {
  console.log('You must specify API_KEY and API_SECRET environment variables');
  process.exit(1);
}

var LAYOUT_TYPE = 'pip';

var VALID_LAYOUTS = ['horizontalpresentation', 'horizontalpresentation', 'pip',
  'bestfit'];
if (VALID_LAYOUTS.indexOf(LAYOUT_TYPE) === -1) {
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
    token: token,
    layoutType: LAYOUT_TYPE
  });
});

app.get('/main', function(req, res) {
  var sessionId = app.get('sessionId'),
      token = opentok.generateToken(sessionId, {
        data:'main',
        initialLayoutClassList: 'focus full'
      });

  res.render('index.ejs', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token,
    layoutType: LAYOUT_TYPE
  });
});

app.get('/broadcast', function(req, res) {
  console.log('broadcast ...');
  return; // TODO:
});

function init() {
  app.listen(5000, function() {
    console.log('Your app is now ready at http://localhost:5000/');
  });
}