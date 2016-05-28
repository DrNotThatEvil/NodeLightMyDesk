import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import Radium from 'radium';
import Websocket from 'react-websocket';

class LayoutBase extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            color: [0,0,0]
        };
    }

    handleData(data)
    {
        // do something with the data
        this.setState({
            color: data
        });
    }

    render()
    {
        var loc = window.location, new_uri;
        if (loc.protocol === 'https:')
        {
            new_uri = 'wss:';
        }
        else
        {
            new_uri = 'ws:';
        }
        new_uri += '//' + loc.host;
        new_uri += loc.pathname + 'install/color';

        return (
            <div style={[{
                width: '100%',
                height: '100%'
            }]}>
                <Websocket url={new_uri} onMessage={this.handleData.bind(this)}/>
                <div style={[{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba('+this.state.color[0]+','+this.state.color[1]+','+this.state.color[2]+',255)'
                }]}></div>
            </div>
        );
    }
}

const Layout = Radium(LayoutBase);

class audioBase extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            color: [0,0,0]
        };
    }

    handleData(data)
    {
        // do something with the data
        this.setState({
            color: data
        });
    }

    render()
    {
        var loc = window.location, new_uri;
        if (loc.protocol === 'https:')
        {
            new_uri = 'wss:';
        }
        else
        {
            new_uri = 'ws:';
        }
        new_uri += '//' + loc.host;
        new_uri += loc.pathname + 'install/color';

        return (
            <div style={[{
                width: '100%',
                height: '100%'
            }]}>
                <Websocket url={new_uri} onMessage={this.handleData.bind(this)}/>
                <div style={[{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba('+this.state.color[0]+','+this.state.color[1]+','+this.state.color[2]+',255)'
                }]}></div>
            </div>
        );
    }
}

const Audio = Radium(audioBase);

export default class Routes extends React.Component
{
    render()
    {
        return (
            <Router history={hashHistory}>
                <Route path="/test" component={Layout} />
                <Route path="/audio" component={Audio} />
            </Router>
        );
    }
}
