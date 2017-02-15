import React from 'react';
import Radium from 'radium';

class PlayerCanvas extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      playing: false,
      amplitude: 100,
      phase: 0
    };
  }

  idleAnimation() {
    this.canvasContext.lineWidth = 1;
    this.canvasContext.strokeStyle = 'rgba(0, 0, 0, 1)';
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    if(this.state.playing == false) {
      requestAnimationFrame(this.idleAnimation.bind(this));
    }

    this.canvasContext.beginPath();
    for(var x = 0; x< this.canvasWidth; x++) {
      this.canvasContext.lineTo(x, Math.sin((x+this.state.phase)/50)*this.state.amplitude + 120); 
    }

    this.canvasContext.stroke();
    var tempIsIncreasing = false;
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
    var trackPermalinkUrl = 'https://soundcloud.com/the-outsider/the-outsider-death-by-melody';
    var clientid = 'client_id=2341a3bad20c6cf96367911d6458a1cc';

    fetch('https://api.soundcloud.com/resolve.json?url=' + trackPermalinkUrl + '&' + clientid)
      .then(response => {
        fetch(response.headers.get('Location'))
          .then(response => response.json())
          .then(json => {
            console.log(json);  
          });
      });
      //.then(json => {
      //  console.log(json);
      //});
  }

  componentDidMount() {
    this.canvasContext = this.canvas.getContext('2d');
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.idleAnimation();
    this.initAudio();
    this.findTrack();
  }

  render() {
    return (
      <div>
        <canvas ref={(c) => { this.canvas = c; }} width="512" height="256"/>
        <audio ref={(a) => { this.audio = a; }} />
      </div>
    );
  }
}

export default Radium(PlayerCanvas);
