var session = TB.initSession(sessionId);
var frameInterval = 1; // every n seconds
var subscribeToSelf = true;

session.on('signal:ascii', function(event) {
  if (subscribeToSelf && event.from !== session.connection) {
    return;
  }
  preview = document.getElementById('subscribers');
  if (preview.firstChild) preview.removeChild(preview.firstChild);
  var asciiDiv = document.createElement('pre');
  asciiDiv.className = asciiDiv.className + ' ascii';
  asciiDiv.textContent = event.data;
  preview.appendChild(asciiDiv);
});

session.connect(apiKey, token, function(error) {
  if (!error) {
    publisher = OT.initPublisher('publisher', {
      insertMode: 'append',
      resolution: '320x240',
      width: '100%',
      height: '100%'
    });
    session.publish(publisher, function(error) {
      sendAsciiSignal();
      setInterval(sendAsciiSignal, 1000 * frameInterval)
    });
  } else {
    console.log('There was an error connecting to the session:', error.code, error.message);
  }
});

function sendAsciiSignal() {
  var imgData = publisher.getImgData();
  var img = document.createElement("img");
  img.setAttribute('src', 'data:image/png;base64,' + imgData);
  img.style.width = '20%'; img.style.height = '20%';
  session.signal({
      data: getAsciiArt(img),
      type: 'ascii'
    },
    function(error) {
      if (error) {
        console.log("signal error ("
                     + error.code
                     + "): " + error.message);
      }
    }
  );
}

// The characters are in order from darkest to lightest, so that their
// position (index) in the string corresponds to a relative color value
// (0 = black).
var palette = '@#$%&8BMW*mwqpdbkhaoQ0OZXYUJCLtfjzxnuvcr[]{}1()|/?Il!i><+_~-;,. ';
// This one's a bit better:
palette = '@#8BM*wpOxnuvcr[]{}1()|/?Il!i><+_~-;,. ';

var paletteLength = palette.length;
var canvas = document.createElement('canvas');
var scaleFactor = .30;

// See httphttp://tinyurl.com/phvnw3e
function getAsciiArt(imgEl) {
  var context = canvas.getContext && canvas.getContext('2d');
  var height = canvas.height = imgEl.naturalHeight * scaleFactor
    || imgEl.offsetHeight * scaleFactor
    || imgEl.height * scaleFactor;
  var width = canvas.width = imgEl.naturalWidth * scaleFactor
    || imgEl.offsetWidth * scaleFactor
    || imgEl.width * scaleFactor;

  context.drawImage(imgEl, 0, 0, width, height);
  var data = context.getImageData(0, 0, width, height);
  var asciiStr = '';
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      var red = data.data[4 * (i * width + j)];
      var green = data.data[4 * (i * width + j) + 1];
      var blue = data.data[4 * (i * width + j) + 2];
      var gray = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 256;
      var palletteIndex = Math.floor( gray * paletteLength);
      asciiStr = asciiStr + palette.charAt(palletteIndex);
    }
    asciiStr = asciiStr + '\n';
  }
  return asciiStr;
}
