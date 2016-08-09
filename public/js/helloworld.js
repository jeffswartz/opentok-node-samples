var session = OT.initSession(sessionId);
var options = {
  insertMode: 'append',
  fitMode: 'contain',
  width: '100%',
  height: '100%',
  publishAudio: false
};

var mainVideoDisplayed = false;

session.on({
  sessionConnected: function(event) {
    var publisherContainer = createStreamContainer();
    if(session.connection.data === 'main') {
      publisherContainer.className = 'stream full focus';
      $('#class-selector').show();
    }
    var publisher = OT.initPublisher(apiKey, publisherContainer, options);
    publisher = session.publish(publisher, () => {
      if (session.connection.data === 'main') {
        $.get('/broadcast/', function(data) {
          console.log('The broadcast is started. Wait 20 seconds, then open this up in Safari: ', data);
        })
        .fail(function() {
          console.log('start broadcast error');
        });
      } else {
        session.on('signal:layoutTypeChange', (event) => {
          setCSS(event.data);
        });
      }
    });
  },
  streamCreated: function(event) {
    var subOptions = {
      insertMode: 'append',
      fitMode: 'contain',
      width: '100%',
      height: '100%',
      subscribeToAudio: false
    };
    var container = createStreamContainer();
    if (event.stream.connection.data === 'main') {
      container.className += ' full focus';
    }
    session.subscribe(event.stream, container, subOptions);
    container.addEventListener('click', () => {
      streamContainers = document.getElementsByClassName('stream');
      for (var i = 0; i < streamContainers.length; i++) {
        var streamContainer = streamContainers[i]
        streamContainer.className = 'stream';
        console.log(streamContainer)
      }
      container.className = 'stream full focus';
    })
  }
});

function createStreamContainer() {
  var containerDiv = document.createElement('div');
  containerDiv.className = 'stream';
  var videoContainer = document.getElementById('video-container');
  videoContainer.appendChild(containerDiv);
  return containerDiv;
}

function setCSS(cssName) {
  var $cssRadios = $('input:radio[value=' + cssName + ']')
    .prop('checked', true);
  $('link[rel=stylesheet][href~="/css/pip.css"]').remove();
  $('link[rel=stylesheet][href~="/css/horizontalpresentation.css"]').remove();
  $('link[rel=stylesheet][href~="/css/verticalpresentation.css"]').remove();
  $('link[rel=stylesheet][href~="/css/bestfit.css"]').remove();
  $.get( '/css/' + cssName + '.css', function( data ) {
    //$( '.result' ).html( data );
    $('head').append('<link rel="stylesheet" type="text/css" href="/css/' + cssName + '.css">');
  });
  if (session.connection.data === 'main') {
    $.get( '/broadcast/layout/' + cssName, function( data ) {
      session.signal({
        type: 'layoutTypeChange',
        data: cssName
      })
    })
    .fail(function() {
      console.log('change broadcast layout error');
    });
  }
}

window.addEventListener('load', function() {
  positionVideoContainer();
  var $cssRadios = $('input:radio[value=' + layoutType + ']')
    .prop('checked', true);
});

window.addEventListener('resize', () => {
  positionVideoContainer();
});

// Maintain a 640 x 480 video container
function positionVideoContainer() {
  var videoContainer = document.getElementById('video-container');
  videoContainer.style.width = document.body.style.innerWidth;
  if (window.innerWidth >= (4 / 3) * window.innerHeight) {
    videoContainer.style.width = window.innerHeight * 4 / 3 + "px";
    videoContainer.style.height = window.innerHeight + "px";
  } else {
    videoContainer.style.height = window.width * 3 / 4 + "px";
    videoContainer.style.width = window.innerWidth + "px";
  }
  console.log(videoContainer.style.width.replace('px', '') /  videoContainer.style.height.replace('px', ''));
}

session.connect(apiKey, token);
