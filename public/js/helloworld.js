var session = TB.initSession(sessionId);
var publisher = TB.initPublisher(apiKey, 'publisher');

session.on({
  sessionConnected: function(event) {
    session.publish(publisher);
  },
  streamCreated: function(event) {
    var subOptions = {insertMode: 'append'};
    session.subscribe(event.stream, 'subscribers', subOptions);
  }
});

session.connect(apiKey, token);
