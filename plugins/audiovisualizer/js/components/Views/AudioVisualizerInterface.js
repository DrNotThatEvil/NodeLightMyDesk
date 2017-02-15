import React from 'react';
import Radium from 'radium';
import Color from 'color';

class AudioVisualizerInterface extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      soundcloudApiToken: '',
    };
  }

  componentDidMount()
  {
    let loc = window.location.href;
    loc = loc.substring(0, loc.indexOf('visualizerstatic/'));

    fetch(loc + 'getvisulizerdata')
    .then(response => response.json())
    .then(json => {
      this.setState(json.data[0]);
    });
  }

  saveData(e)
  {
    e.preventDefault();
    e.stopPropagation();

    let loc = window.location.href;
    loc = loc.substring(0, loc.indexOf('visualizerstatic/'));


    fetch(loc + 'setvisualizerdata',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        config: {
          soundcloudApiToken: this.state.soundcloudApiToken,
        }
      })
    })
    .then(response => response.json());
    //.then(json => {
      //console.log(json);
    //});
  }

  handleChange(e)
  {
    return (key) => {
      let state = {};
      state[key] = e.target.value;
      this.setState(state);
    };
  }

  render()
  {
    return (
      <div className="container" style={[{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }]}>
        <div style={[{
          width: 800,
          height: 900,
          overflow: 'hidden',
          backgroundColor: Color('#2c503e').lighten(0.50).hexString(),
          border: '2px solid #ff3a00',
          borderRadius: 15,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          fontFamily: 'cabinbold',
          fontSize: 18,
          color: '#FFFFFF'
        }]}>
          <div style={[{
            marginTop: 10
          }]}>
            <img src={require('../../../img/soundcloud_logo.png')} style={[{
              width: 100,
              height: 100
            }]}/>
          </div>
          <div style={[{
            marginTop: 10,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
          }]}>
            <span>Soundcloud api token:</span>
            <input type="text" style={[styles.input]} value={this.state.emailServer} onChange={ (e) => {this.handleChange(e)('emailServer');} }/>
          </div>
          <div style={[{
            marginTop: 10,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
          }]}>
            <input type="submit" style={[styles.submit]} value="Save settings" onClick={this.saveData.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Radium(AudioVisualizerInterface);

var styles = {
  input:
  {
    marginTop: 10,
    display: 'block',
    border: '3px solid #ff3a00',
    backgroundColor: '#060D1E',
    height: 30,
    width: 100,
    fontSize: '16px',
    padding: 10,
    color: '#2468FF',
    fontFamily: 'cabinregular',
    textAlign: 'center'
  },
  submit:
  {
    marginTop: 0,
    display: 'block',
    border: '3px solid ' + Color('#ff3a00').darken(0.25).hexString(''),
    backgroundColor: '#2468FF',
    height: 30,
    width: 120,
    fontSize: '24px',
    padding: 10,
    color: '#FFFFFF',
    fontFamily: 'cabinbold',
    textAlign: 'center',
    borderRadius: 15
  }
};
