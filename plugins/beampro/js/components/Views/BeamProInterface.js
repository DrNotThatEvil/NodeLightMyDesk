import React from 'react';
import Radium from 'radium';
import Color from 'color';

class TwitchInterface extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            streamId: '',
            username: '',
            password: '',
            facode: '',
            streamJarApi: ''
        };
    }

    componentDidMount()
    {
        let loc = window.location.href;
	       loc = loc.substring(0, loc.indexOf('beamprostatic/'));

        fetch(loc + 'getbeamdata')
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
        loc = loc.substring(0, loc.indexOf('beamprostatic/'));

        fetch(loc + 'setbeamdata',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                config: {
                    streamId: this.state.streamId,
                    username: this.state.username,
                    password: this.state.password,
                    facode: this.state.facode,
                    streamJarApi: this.state.streamJarApi
                }
            })
        })
        .then(response => response.json())
        .then(json => {
            console.log(json);
        });
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
                        <img src={require('../../../img/beampro_logo.png')} style={[{
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
                        <span>streamId:</span>
                        <input type="text" style={[styles.input]} value={this.state.streamId} onChange={ (e) => {this.handleChange(e)('streamId');} }/>
                    </div>
                    <div style={[{
                        marginTop: 10,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }]}>
                        <span>Beampro username:</span>
                        <input type="text" style={[styles.input]} value={this.state.username} onChange={ (e) => {this.handleChange(e)('username');} }/>
                    </div>
                    <div style={[{
                        marginTop: 10,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }]}>
                        <span>Beampro password:</span>
                        <input type="password" style={[styles.input]} value={this.state.password} onChange={ (e) => {this.handleChange(e)('password');} }/>
                    </div>
                    <div style={[{
                        marginTop: 10,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }]}>
                        <span>Beampro 2 Factor code:</span>
                        <input type="facode" style={[styles.input]} value={this.state.facode} onChange={ (e) => {this.handleChange(e)('facode');} }/>
                    </div>
                    <div style={[{
                        marginTop: 10
                    }]}>
                        <img src={require('../../../img/streamjar_logo.png')} style={[{
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
                        <span>Steam jar api token:</span>
                        <input type="password" style={[styles.input]} value={this.state.streamJarApi} onChange={ (e) => {this.handleChange(e)('streamJarApi');} }/>
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

export default Radium(TwitchInterface);

var styles = {
    input:
    {
        marginTop: 10,
        display: 'block',
        border: '3px solid #766CD8',
        backgroundColor: '#060D1E',
        height: 60,
        width: 350,
        fontSize: '24px',
        padding: 10,
        color: '#766CD8',
        fontFamily: 'cabinregular',
        textAlign: 'center'
    },
    submit:
    {
        marginTop: 0,
        display: 'block',
        border: '3px solid ' + Color('#766CD8').darken(0.25).hexString(),
        backgroundColor: '#766CD8',
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
