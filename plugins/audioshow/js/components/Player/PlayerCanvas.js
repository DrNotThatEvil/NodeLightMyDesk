import React from 'react';
import Radium from 'radium';

/**
* HSV to RGB color conversion
*
* H runs from 0 to 360 degrees
* S and V run from 0 to 100
*
* Ported from the excellent java algorithm by Eugene Vishnevsky at:
* http://www.cs.rit.edu/~ncs/color/t_convert.html
*/
function hsvToRgb(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;
     
    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));
     
    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;
     
    if(s == 0) {
        // Achromatic (grey)
        r = g = b = v;
        return [
            Math.round(r * 255), 
            Math.round(g * 255), 
            Math.round(b * 255)
        ];
    }
     
    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
     
    switch(i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
     
        case 1:
            r = q;
            g = v;
            b = p;
            break;
     
        case 2:
            r = p;
            g = v;
            b = t;
            break;
     
        case 3:
            r = p;
            g = q;
            b = v;
            break;
     
        case 4:
            r = t;
            g = p;
            b = v;
            break;
     
        default: // case 5:
            r = v;
            g = p;
            b = q;
    }
     
    return [
        Math.round(r * 255), 
        Math.round(g * 255), 
        Math.round(b * 255)
    ];
}


function redYellowGreen(min, max, value) {
  var p = ((value - min) / (max - min));
  
  if (p < 0 || p > 1) {
    return {
      red: 0,
      green: 0,
      blue: 0
    };
  }

  var hsv = hsvToRgb((120 * p), 100, 100);

  // these values are flipped cause we want red on the top and green at te bottom.
  return {
    red: hsv[1],
    green: hsv[0], 
    blue: 0
  };
}

class PlayerCanvas extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      playing: false,
      amplitude: 100,
      phase: 0,
      isIncreasing: false,
      streamUrl: ''
    };

    this.handlePlay = this.handlePlay.bind(this);
    this.idleAnimation = this.idleAnimation.bind(this);
    this.drawAgain = this.drawAgain.bind(this);
  }

  idleAnimation() {
    this.canvasContext.lineWidth = 1;
    this.canvasContext.strokeStyle = 'rgba(0, 0, 0, 1)';
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    if(this.state.playing == false) {
      requestAnimationFrame(this.idleAnimation);
    }

    this.canvasContext.beginPath();
    for(var x = 0; x< this.canvasWidth; x++) {
      this.canvasContext.lineTo(x, Math.sin((x+this.state.phase)/50)*this.state.amplitude + 120); 
    }

    this.canvasContext.stroke();
    var tempIsIncreasing = this.state.isIncreasing;
    var tempAmplitude = this.state.amplitude;
    
    if(tempAmplitude > 100) {
      tempIsIncreasing = false;
    } else if(tempAmplitude < 1) {
      tempIsIncreasing = true;
    } 

    if(tempIsIncreasing) {
      tempAmplitude++;
    } else {
      tempAmplitude--; 
    }

    this.setState({
      amplitude: tempAmplitude,
      isIncreasing: tempIsIncreasing,
      phase: (this.state.phase+1)
    });
  } 

  initAudio() {
    this.audioContext = new window.AudioContext();
    this.audio = new Audio();
    this.audio.crossOrigin = 'anonymous';
    this.audiosource = this.audioContext.createMediaElementSource(this.audio);
    this.audiosource.connect(this.audioContext.destination);
    this.analyser = this.audioContext.createAnalyser();
    this.audiosource.connect(this.analyser);
  }

  findTrack() {
    //var trackPermalinkUrl = 'https://soundcloud.com/the-outsider/the-outsider-death-by-melody';
    //var trackPermalinkUrl = 'https://soundcloud.com/murtaghmusic/murtagh-synapse';
    var trackPermalinkUrl = 'https://soundcloud.com/ornomusic/amethyst';
    var clientid = 'client_id=2341a3bad20c6cf96367911d6458a1cc';

    //var streamUrl = '';
    fetch('https://api.soundcloud.com/resolve.json?url=' + trackPermalinkUrl + '&' + clientid).then((response) => {
      return response.json().then((json) => {
        var streamUrl = json.stream_url + '?' + clientid;
        return streamUrl;
      });
    }).then((streamUrl) => {
      this.setState({
        streamUrl: streamUrl
      });
    });

  }

  componentDidMount() {
    this.reconnectWebsocket();
    this.canvasContext = this.canvas.getContext('2d');
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.idleAnimation();
    this.initAudio();
    this.findTrack();
  }

  reconnectWebsocket() {
    var wsLocation = 'ws://' + window.location.hostname + ':8801';
    this.ws = new WebSocket(wsLocation);
    this.ws.onclose = function(){
      //try to reconnect in 5 seconds
      setTimeout(function() { this.reconnectWebsocket() }.bind(this), 5000);
    }.bind(this);
  }

  startDrawing() {
    this.setState({
      isPlaying: true
    });

    this.analyser.ttfSize = 64;
    this.canvasContext.lineWidth = 1;
    this.canvasContext.strokeStyle = 'rgba(0,0,0, 1)';
    this.drawAgain(true);
  }

  drawAgain(pregen) {
    this.canvasContext.clearRect(0,0, this.canvasWidth, this.canvasHeight);
    requestAnimationFrame(this.drawAgain);

    var bufferLength =  this.analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    this.analyser['getByteFrequencyData'](dataArray);
    
    var amountOfLeds = 50;
    var spacing = (this.canvasWidth - 15) / amountOfLeds;
    //TODO: REPLACE amountOfLeds WITH THE AMOUNT OF LEDS FROM THE LED CONTROLLER
    //
    var webSocketData = [];
    for(var i=0; i<amountOfLeds; i++) {
      var sum = 0;
      for(var j=0; j <(bufferLength/amountOfLeds); j++) {
        sum += dataArray[(i+j)]; 
      }

      var avg = (sum / (bufferLength/amountOfLeds));
      this.canvasContext.beginPath();
      this.canvasContext.moveTo((i+1) * spacing, 255);
      var rgbObject = redYellowGreen(0, 255, avg);
      webSocketData.push([rgbObject.red, rgbObject.green]);
      this.canvasContext.strokeStyle = 'rgba(' + rgbObject.red + ', ' + rgbObject.green + ', ' + rgbObject.blue + ', 1)';
      
      this.canvasContext.lineTo((i+1) * spacing, 255 - avg);
      this.canvasContext.closePath();
      this.canvasContext.stroke();
    }

    if(this.ws.readyState == 1){
      var websocketSendData = JSON.stringify({leds: webSocketData.reverse()});
      this.ws.send(websocketSendData);
    }
  }

  handlePlay() {
    this.audio.src = this.state.streamUrl;
    this.audio.play();

    this.startDrawing();
  }

  render() {
    return (
      <div>
        <canvas ref={(c) => { this.canvas = c; }} width="512" height="256"/>
        <button onClick={this.handlePlay}>
          Play
        </button>
      </div>
    );
  }
}

export default Radium(PlayerCanvas);
