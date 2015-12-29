var express = require('express'),
  basicAuth = require('basic-auth'),
  bodyParser = require('body-parser'),
  OpenTok = require('opentok');

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
var sessionId;
var instructor;

if (!apiKey || !apiSecret) {
  console.log('You must specify API_KEY and API_SECRET environment variables');
  process.exit(1);
}

var app = express();
app.use(express.static(__dirname + '/public'));

var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'instructor' && user.pass === 'password') {
    instructor = true;
    return next();
  } else if (user.name === 'student' && user.pass === 'password') {
    instructor = false;
    return next();
  } else {
    return unauthorized(res);
  };
};

app.use(bodyParser.urlencoded({
  extended: true
}));

var opentok = new OpenTok(apiKey, apiSecret);

opentok.createSession({ mediaMode: 'routed' }, function(err, session) {
  if (err) throw err;
  app.set('sessionId', session.sessionId);
  init();
});

app.get('/', auth, function(req, res) {
  sessionId =  app.get('sessionId'),
  token = opentok.generateToken(sessionId, {
    role: instructor ? 'moderator' : 'publisher',
    data: instructor ? 'instructor' : ''
  });

  res.render('index.ejs', {
    apiKey: apiKey,
    sessionId: sessionId,
    token: token,
    instructor: instructor
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
  var port = process.env.PORT || 3000;
  app.listen(port, function() {
    console.log('You\'re app is now ready at http://localhost:' + port + '/');
  });
}