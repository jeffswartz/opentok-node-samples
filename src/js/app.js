var layoutManager = require('opentok-layout-js');

var archiveId;
var session = OT.initSession(sessionId);

var layout = layoutManager.initLayoutContainer(document.getElementById('videos'), {
  bigClass: "OT_big",
  bigPercentage: 0.8
});
var otVideoOptions = {insertMode: 'append', fitMode: 'contain', width: '100%', height: '100%'};
$('#videos').append('<div id="instructorContainer"></div>');
if (instructor) {
  $('#instructorContainer').addClass('OT_big');
}
var publisher = OT.initPublisher('instructorContainer', otVideoOptions);
layout.layout();

session.on({
  sessionConnected: function(event) {
    session.publish(publisher);
    if (instructor) {
      $('#startArchive').show();
    }
  },
  streamCreated: function(event) {
    var $subscriberContainer = $('<div id="subscriber-' + event.stream.streamId + '"></div>').appendTo('#videos')
    if (event.stream.connection.data === 'instructor' && $('.OT_big').length === 0) {
      $subscriberContainer.addClass('OT_big');
    }
    session.subscribe(event.stream, $subscriberContainer[0], otVideoOptions);
    layout.layout();
  },
  streamDestroyed: function(event) {
    layout.layout();
  },
  archiveStarted: function(event) {
    archiveId = event.id;
  },
  archiveStopped: function(event) {
    if (instructor) {
      $('#viewArchive').show();
    }
  }
});

$(window).resize(function() {
  $( "#videos" ).width($(window).width()).height($(window).height());
  layout.layout();
});

session.connect(apiKey, token);

$('#startArchive').click(function() {
  $.ajax({
    type: 'POST',
    url: '/start',
    success: function(responseData, textStatus, jqXHR) {
      console.log('Archive started.');
      var obj = responseData;
    },
    error: function (responseData, textStatus, errorThrown) {
      console.log('startArchive POST failed.', responseData, textStatus, errorThrown);
    }
  });
  if (instructor) {
    $('#startArchive').hide();
    $('#stopArchive').show();
  }
});

$('#stopArchive').click(function() {
  $.ajax({
    type: 'GET',
    url: '/stop/' + archiveId,
    success: function(responseData, textStatus, jqXHR) {
      console.log('Archive stopped.');
    },
    error: function (responseData, textStatus, errorThrown) {
      console.log('startArchive POST failed.', responseData, textStatus, errorThrown);
    }
  });
  $('#stopArchive').hide();
});
$('#viewArchive').click(function() {
  window.open('/download/' + archiveId);
  $('#viewArchive').hide();
});
