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

  IdleAnimation() {
    this.canvasContext.lineWidth = 1;
    this.canvasContext.strokeStyle = 'rgba(0, 0, 0, 1)';
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    if(this.state.playing == false) {
      requestAnimationFrame(this.IdleAnimation.bind(this));
    }

    this.canvasContext.beginPath();
    for(var x = 0; x< this.canvasWidth; x++) {
      this.canvasContext.lineTo(x, Math.sin((x+this.state.phase)/50)*this.state.amplitude + 120); 
    }

    this.canvasContext.stroke();
    var tempIsIncreasing;
    var tempAmplitude = this.state.amplitude;
    
    if(tempAmplitude >= 100) {
      tempIsIncreasing = false;
    } else if(tempAmplitude <= 1) {
      tempIsIncreasing = true;
    } 

    if(tempIsIncreasing) {
      tempAmplitude++;
    } else {
      tempAmplitude--; 
    }

    this.setState({
      amplitude: tempAmplitude,
      phase: this.tempAmplitude
    });
  }

  componentDidMount() {
    this.canvasContext = this.canvas.getContext('2d');
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.IdleAnimation();
  }

  render() {
    return (
      <canvas ref={(c) => { this.canvas = c; }} />
    );
  }
}

export default Radium(PlayerCanvas);
