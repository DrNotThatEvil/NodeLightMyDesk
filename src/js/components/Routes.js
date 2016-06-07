import React from 'react';
import { Router, Route, hashHistory, withRouter } from 'react-router';
import Radium from 'radium';
import Websocket from 'react-websocket';
import serverActions from '../actions/serverActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Install from './Views/Install';
import Dashboard from './Views/Dashboard';

class RoutesBgBase extends React.Component
{
    static propTypes = {
        server: React.PropTypes.object.isRequired
    };

    constructor(props)
    {
        super(props);
        this.state = {
            color: [0,0,0],
            duration: 500
        };
    }

    handleData(data)
    {
        //console.log(data);
        // do something with the data
        if(data.type == 'fadeout')
        {
            this.setState({
                color: [0,0,0],
                duration: (data.data.delay*100)
            });
        }

        if(data.type == 'fadein')
        {
            this.setState({
                color: data.data.color,
                duration: (data.data.delay*100)
            });
        }

        if(data.constructor === Array)
        {
            this.setState({
                color: data
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
        new_uri += '//' + loc.hostname + ':8880';


        return (
            <div style={[{
                width: '100%',
                height: '100%'
            }]}>
                <Websocket url={new_uri} onMessage={this.handleData.bind(this)}/>
                <div style={[{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba('+this.state.color[0]+','+this.state.color[1]+','+this.state.color[2]+', 0.25)',
                    willChange: 'background-color',
                    transitionDuration: this.state.duration + 'ms',
                    transitionProperty: 'background-color'
                }]}>
                    { this.props.children }
                </div>
            </div>
        );
    }
}

//const RoutesBg = Radium(RoutesBgBase);

const mapStateToPropsBg = (store) => {
    return { server: store.server };
};

const RoutesBg = connect(
    mapStateToPropsBg
)(Radium(RoutesBgBase));

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

        this.props.fetchInstalled((value) => {
            if(value)
            {
                hashHistory.replace('/');
            }
        });
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
            replace('/install');
        }
    }

    render()
    {
        return (
            <RoutesBg>
                <Router history={hashHistory}>
                    <Route path="/install" component={Install} />
                    <Route path="/" component={Dashboard} onEnter={this.requireInstall.bind(this)}>

                    </Route>
                </Router>
            </RoutesBg>
        );
    }
}

const mapStateToProps = (store) => {
    return { server: store.server };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchInstalled: serverActions.fetchInstalled
    }, dispatch);
};

const VisibleRoutes = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Radium(Routes)));

export default VisibleRoutes;
