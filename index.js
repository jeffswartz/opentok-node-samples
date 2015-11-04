var express = require('express'),
    bodyParser = require('body-parser'),
    OpenTok = require('opentok');

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
var sessionId;

if (!apiKey || !apiSecret) {
  console.log('You must specify API_KEY and API_SECRET environment variables');
  process.exit(1);
}

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

var opentok = new OpenTok(apiKey, apiSecret);

opentok.createSession({ mediaMode: 'routed' }, function(err, session) {
  if (err) throw err;
  app.set('sessionId', session.sessionId);
  init();
});

app.get('/', function(req, res) {
  sessionId =  app.get('sessionId'),
      token = opentok.generateToken(sessionId);

  res.render('index.ejs', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token
  });
});

app.get('/download/:archiveId', function(req, res) {
  var archiveId = req.param('archiveId');
  opentok.getArchive(archiveId, function(err, archive) {
    if (err) return res.send(500, 'Could not get archive '+archiveId+'. error='+err.message);
    res.redirect(archive.url);
  });
});

app.post('/start', function(req, res) {
  /*
  var hasAudio = (req.param('hasAudio') !== undefined);
  var hasVideo = (req.param('hasVideo') !== undefined);
  var outputMode = req.param('outputMode');
  console.log('apiKey', apiKey);
  */
  opentok.startArchive(app.get('sessionId'), {
    name: 'Node Archiving Sample App'
  }, function(err, archive) {
    if (err) {
      console.log('err ', err.message);
      return res.send(500,
        'Could not start archive for session ' + sessionId + '. Error: ' + err.message
      );
    }
    res.json(archive);
  });
});

app.get('/stop/:archiveId', function(req, res) {
  var archiveId = req.param('archiveId');
  opentok.stopArchive(archiveId, function(err, archive) {
    if (err) {
      return res.send(500, 'Could not stop archive ' + archiveId + '. error='
        + err.message);
      }
    res.json(archive);
  });
});

function init() {
  app.listen(5000, function() {
    console.log('You\'re app is now ready at http://localhost:5000/');
  });
}