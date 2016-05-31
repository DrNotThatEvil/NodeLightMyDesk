import React from 'react';
import { Router, Route, hashHistory } from 'react-router';
import Radium from 'radium';
import Websocket from 'react-websocket';
import { connect } from 'react-redux';

import Install from './Views/Install';
import Test from './Views/Test';

class Routes extends React.Component
{
    static propTypes = {
        server: React.PropTypes.object.isRequired
    };

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

    requireInstall(nextState, replace)
    {
        const state = this.props.server;
        if(!state.installed)
        {
            replace({
                pathname: '/install',
                state: { nextPathname: nextState.location.pathname }
            });
        }
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
                    background: 'rgba('+this.state.color[0]+','+this.state.color[1]+','+this.state.color[2]+',0.5)',
                }]}>
                    <Router history={hashHistory}>
                        <Route path="/install" component={Install} />
                        <Route path="/test" component={Test} onEnter={this.requireInstall.bind(this)} />
                    </Router>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (store) => {
    return store;
};
const VisibleRoutes = connect(
    mapDispatchToProps
)(Radium(Routes));

export default VisibleRoutes;
