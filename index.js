var express = require('express');
var OpenTok = require('opentok');
var request = require('request');

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
var sessionId;

if (!apiKey || !apiSecret) {
  console.log('You must specify API_KEY and API_SECRET environment variables');
  process.exit(1);
}

var LAYOUT_TYPE = 'bestfit';

var VALID_LAYOUTS = ['horizontalpresentation', 'horizontalpresentation', 'pip',
  'bestfit'];
if (VALID_LAYOUTS.indexOf(LAYOUT_TYPE) === -1) {
  console.log('You must specify API_KEY and API_SECRET environment variables');
  process.exit(1);
}

var app = express();
app.use(express.static(__dirname + '/public'));

var opentok = new OpenTok(apiKey, apiSecret);

var sessionOptions = {mediaMode:'routed'};
opentok.createSession(sessionOptions, function(err, session) {
  if (err) throw err;
  app.set('sessionId', session.sessionId);
  init();
});

app.get('/', function(req, res) {
  sessionId = app.get('sessionId'),
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
  var sessionId = app.get('sessionId');
  var req = {
    uri: 'https://api.opentok.com/v2/partner/' + apiKey + '/broadcast',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-TB-PARTNER-AUTH': apiKey + ':' + apiSecret
    },
    json: {
      sessionId: sessionId,
      layout: { 
        type: LAYOUT_TYPE
      }
    }
  };
  request(req, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      app.set('broadcastId', body.id);
      res.send(body.broadcastUrls.hls) 
    } else {
      console.log(error, response.body.message);
    }
  })
});

app.get('/broadcast/layout/:layoutType', function(req, res) {
  var layoutType = req.params.layoutType;
  console.log('change layout type', layoutType);
  var sessionId = app.get('sessionId');
  var broadcastId = app.get('broadcastId');
  var req = {
    uri: 'https://api.opentok.com/v2/partner/' + apiKey + '/broadcast/' +
      broadcastId + '/layout',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-TB-PARTNER-AUTH': apiKey + ':' + apiSecret
    },
    json: {
      type: layoutType
    }
  };
  request(req, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send('');
      console.log('layoutType changed');
    } else {
      console.log(error, response.statusCode);
      res.send(response);
    }
  })
});

function init() {
  app.listen(5000, function() {
    console.log('Your app is now ready at http://localhost:5000/');
  });
}