import React from 'react';
import Radium from 'radium';
import Color from 'color';

class EmailInterface extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            emailServer: '',
            emailPort: '',
            emailAddress: '',
            emailPassword: '',
            emailImportant: ''
        };
    }

    componentDidMount()
    {
        let loc = window.location.href;
	loc = loc.substring(0, loc.indexOf('emailstatic/'));

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
	loc = loc.substring(0, loc.indexOf('emailstatic/'));


        fetch(loc + 'setdata',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                config: {
                    emailServer: this.state.emailServer,
                    emailPort: this.state.emailPort,
                    emailAddress: this.state.emailAddress,
                    emailPassword: this.state.emailPassword,
                    emailImportant: this.state.emailImportant
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
                        <span>Email server:</span>
                        <input type="text" style={[styles.input]} value={this.state.emailServer} onChange={ (e) => {this.handleChange(e)('emailServer');} }/>
                    </div>
                    <div style={[{
                        marginTop: 10,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }]}>
                        <span>Email server port:</span>
                        <input type="text" style={[styles.input]} value={this.state.emailPort} onChange={ (e) => {this.handleChange(e)('emailPort');} }/>
                    </div>
                    <div style={[{
                        marginTop: 10,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }]}>
                        <span>Email address:</span>
                        <input type="text" style={[styles.input]} value={this.state.emailAddress} onChange={ (e) => {this.handleChange(e)('emailAddress');} }/>
                    </div>
                    <div style={[{
                        marginTop: 10,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }]}>
                        <span>Email password:</span>
                        <input type="password" style={[styles.input]} value={this.state.emailPassword} onChange={ (e) => {this.handleChange(e)('emailPassword');} }/>
                    </div>
                    <div style={[{
                        marginTop: 10,
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }]}>
                        <span>Email important:</span>
                        <input type="text" style={[styles.input]} value={this.state.emailImportant} onChange={ (e) => {this.handleChange(e)('emailImportant');} }/>
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

export default Radium(EmailInterface);

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
        border: '3px solid ' + Color('#2468FF').darken(0.25).hexString(),
        backgroundColor: '#2468FF',
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
