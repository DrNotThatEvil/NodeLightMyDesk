import React from 'react';
import Radium from 'radium';
import Color from 'color';

class TwitchInterface extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            twitchServer: '',
            twitchPort: '',
            twitchOauth: '',
            twitchChannel: '',
            twitchNick: '',
            twitchAlertsToken: ''
        };
    }

    componentDidMount()
    {
        let loc = window.location.href;

        fetch(loc + 'getdata')
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

        fetch(loc + 'setdata',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                config: {
                    twitchServer: this.state.twitchServer,
                    twitchPort: this.state.twitchPort,
                    twitchOauth: this.state.twitchOauth,
                    twitchChannel: this.state.twitchChannel,
                    twitchNick: this.state.twitchNick,
                    twitchAlertsToken: this.state.twitchAlertsToken
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
                        <img src={require('../../../img/twitch_logo.png')} style={[{
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
                        <span>Twitch Irc server:</span>
                        <input type="text" style={[styles.input]} value={this.state.twitchServer} onChange={ (e) => {this.handleChange(e)('twitchServer');} }/>
                    </div>
                    <div style={[{
                        marginTop: 10,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }]}>
                        <span>Twitch Irc server port:</span>
                        <input type="text" style={[styles.input]} value={this.state.twitchPort} onChange={ (e) => {this.handleChange(e)('twitchPort');} }/>
                    </div>
                    <div style={[{
                        marginTop: 10,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }]}>
                        <span>Twitch Oauth:</span>
                        <input type="password" style={[styles.input]} value={this.state.twitchOauth} onChange={ (e) => {this.handleChange(e)('twitchOauth');} }/>
                    </div>
                    <div style={[{
                        marginTop: 10,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }]}>
                        <span>Twitch Channel:</span>
                        <input type="text" style={[styles.input]} value={this.state.twitchChannel} onChange={ (e) => {this.handleChange(e)('twitchChannel');} }/>
                    </div>
                    <div style={[{
                        marginTop: 10,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }]}>
                        <span>Twitch nick:</span>
                        <input type="text" style={[styles.input]} value={this.state.twitchNick} onChange={ (e) => {this.handleChange(e)('twitchNick');} }/>
                    </div>
                    <div style={[{
                        marginTop: 10,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }]}>
                        <span>Twitch Alerts access token:</span>
                        <input type="password" style={[styles.input]} value={this.state.twitchAlertsToken} onChange={ (e) => {this.handleChange(e)('twitchAlertsToken');} }/>
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
