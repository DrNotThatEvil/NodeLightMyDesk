import React from 'react';
import Radium from 'radium';
import Color from 'color';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import SidebarStyle from './SidebarStyle';
import SidebarItem from './SidebarItem';
import ColorStateItem from './ColorStateItem';

import dashboardActions from '../../actions/dashboardActions';

const Menu = require('react-burger-menu').slide;

class Sidebar extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            plugins: []
        };
    }

    componentDidMount()
    {
        this.props.fetchSidebarPlugins((data) => {
            this.setState({
                plugins: data
            });
        });
    }

    isMenuOpen(state)
    {
        return state.isOpen;
    }

    onPluginToggle(id)
    {
        return (value) => {
            this.props.setModuleStatus(id, value, (change) => {
                this.setState({
                    plugins: this.state.plugins.map((obj) => {
                        if(obj.id == id)
                            obj.status = change;
                        return obj;
                    })
                });
            });
        };
    }

    fetchPlugins(e)
    {
        e.stopPropagation();
        e.preventDefault();

        this.props.fetchSidebarPlugins((data) => {
            this.setState({
                plugins: data
            });
        });
    }

    turnoffplugins()
    {
        let plugins = this.state.plugins.map((obj) => {
            this.props.setModuleStatus(obj.id, false, () => {});
            let nObj = obj;
            nObj.status = false;
            return nObj;
        });

        this.setState({
            plugins: plugins
        }, () => {
            console.log(this.state);
        });
    }

    render()
    {
        return (
            <div key="sidebar" style={[styles.container]}>
                <Menu styles={ menuStyles } width={ 265 } onStateChange={ this.isMenuOpen.bind(this) } noOverlay isOpen>
                    <ColorStateItem onOffClick={this.turnoffplugins.bind(this)} />
                    <SidebarItem title="Settings" icon="fa fa-cog" />
                    <SidebarItem title="Plugins" handleClick={this.fetchPlugins.bind(this)}>
                        {this.state.plugins.map((obj, i) => {
                            return <SidebarItem key={i} title={obj.name} switch={true} switchState={obj.status} handleClick={(e) => this.props.pluginClicked(e)(obj.url)} onToggle={this.onPluginToggle.bind(this)(obj.id)} />;
                        })}
                    </SidebarItem>
                </Menu>
            </div>
        );
    }
}

//export default Radium(Sidebar);

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchSidebarPlugins: dashboardActions.fetchSidebarPlugins,
        setModuleStatus: dashboardActions.setModuleStatus
    }, dispatch);
};

const VisibleSidebar = connect(
    () => { return {}; },
    mapDispatchToProps
)(Radium(Sidebar));

export default VisibleSidebar;

var menuStyles = {
    bmBurgerButton: {
        position: 'fixed',
        width: 27,
        height: 22,
        left: 18,
        top: 18
    },
    bmBurgerBars: {
        background: SidebarStyle.menuBg
    },
    bmCrossButton: {
        height: 22,
        width: 27
    },
    bmCross: {
        background: Color(SidebarStyle.font).lighten(0.5).hexString(),
        height: 20
    },
    bmMenu: {
        background: SidebarStyle.menuBg,
        padding: 0,
        fontSize: '1.15em',
        BorderRight: '1px solid ' + Color(SidebarStyle.menuBg).darken(0.05).hexString(),
	overflow: 'hidden',
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        color: '#b8b7ad',
        paddingTop: 45
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
};

var styles = {
    container:
    {

    }
};
