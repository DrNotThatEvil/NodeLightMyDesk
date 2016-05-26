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
        return (
            <div style={[{
                width: '100%',
                height: '100%'
            }]}>
                <Websocket url='ws://localhost:3000/install/color' onMessage={this.handleData.bind(this)}/>
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

export default class Routes extends React.Component
{
    render()
    {
        return (
            <Router history={hashHistory}>
                <Route path="/test" component={Layout} />
            </Router>
        );
    }
}
