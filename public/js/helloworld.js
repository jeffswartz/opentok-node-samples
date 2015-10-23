var session = TB.initSession(sessionId);
var publisher = TB.initPublisher(apiKey, 'publisher');
var subs = [];
var cardsDiv = document.getElementById('cards');

session.on({
  sessionConnected: function(event) {
    session.publish(publisher, function(error) {
      var card = document.createElement('img');
      card.setAttribute('src', '/img/cah-question.png');
      card.setAttribute('width', '264');
      cards.appendChild(card);
    });
  },
  streamCreated: function(event) {
    var subOptions = {insertMode: 'append'};
    var sub = session.subscribe(event.stream, 'subscribers', subOptions, function(error) {
      subs.push(sub);
      arrangeSubs();
      var card = document.createElement('img');
      console.log('/img/cah-answer' + (subs.length - 1) + '.png')
      card.setAttribute('src', '/img/cah-answer' + (subs.length - 1) + '.png');
      //card.setAttribute('src', '/img/cah-answer0.png');
      card.setAttribute('width', '264');
      cards.appendChild(card);
    });
  }
});

function arrangeSubs() {
  for (var i = 0; i < subs.length; i++) {
    sub = subs[i];
    sub.element.style.left = i * 264 + 'px';
  }
}

session.connect(apiKey, token);
