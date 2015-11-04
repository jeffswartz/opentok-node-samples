var archiveId;
var session = TB.initSession(sessionId);
var publisher = TB.initPublisher(apiKey, 'publisher');

session.on({
  sessionConnected: function(event) {
    session.publish(publisher);
    $('#startArchive').show();
  },
  streamCreated: function(event) {
    var subOptions = {insertMode: 'append'};
    session.subscribe(event.stream, 'subscribers', subOptions);
  },
  archiveStarted: function(event) {
    archiveId = event.id;
  }
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
  $('#startArchive').hide();
  $('#stopArchive').show();
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
