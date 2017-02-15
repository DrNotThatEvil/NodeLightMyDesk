import React from 'react';
import Radium from 'radium';
import Color from 'color';

class AudioshowInterface extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = {
      soundcloudApi: ''
    };
  }

  componentDidMount()
  {
    let loc = window.location.href;
    loc = loc.substring(0, loc.indexOf('audioshowstatic/'));

    fetch(loc + 'getaudioshowdata')
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
    loc = loc.substring(0, loc.indexOf('audioshowstatic/'));


    fetch(loc + 'setaudioshowdata',{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        config: {
          soundcloudApi: this.state.soundcloudApi
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
          border: '2px solid #2c503e',
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
            <img src={require('../../../img/email_logo.png')} style={[{
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
            <span>Soundcloud Api token:</span>
            <input type="text" style={[styles.input]} value={this.state.soundcloudApi} onChange={ (e) => {this.handleChange(e)('soundcloudApi');} }/>
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

export default Radium(AudioshowInterface);

var styles = {
  input:
  {
    marginTop: 10,
    display: 'block',
    border: '3px solid #2468FF',
    backgroundColor: '#060D1E',
    height: 60,
    width: 350,
    fontSize: '24px',
    padding: 10,
    color: '#2468FF',
    fontFamily: 'cabinregular',
    textAlign: 'center'
  },
  submit:
  {
    marginTop: 0,
    display: 'block',
    border: '3px solid ' + Color('#ff8800').darken(0.25).hexString(),
    backgroundColor: '#ff8800',
    height: 60,
    width: 350,
    fontSize: '24px',
    padding: 10,
    color: '#FFFFFF',
    fontFamily: 'cabinbold',
    textAlign: 'center',
    borderRadius: 15
  }
};
