import React from 'react';
import Radium from 'radium';
import Color from 'color';

import SidebarStyle from './SidebarStyle';
import SidebarItem from './SidebarItem';

const Menu = require('react-burger-menu').slide;

class Sidebar extends React.Component {
    constructor(props)
    {
        super(props);
    }

    isMenuOpen(state) {
        return state.isOpen;
    }

    render()
    {
        return (
            <div key="sidebar" style={[styles.container]}>
                <Menu styles={ menuStyles } width={ 265 } onStateChange={ this.isMenuOpen.bind(this) } noOverlay>
                    <SidebarItem title="Projects">
                        <SidebarItem title="Join project" icon="fa fa-user-plus" />
                        <SidebarItem title="Create project" icon="fa fa-pencil-square-o" handleClick={this.openCreateProjectModal.bind(this)} />
                    </SidebarItem>
                </Menu>
            </div>
        );
    }
}

export default Radium(Sidebar);

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
        borderRight: '1px solid ' + Color(SidebarStyle.menuBg).darken(0.05).hexString()
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        color: '#b8b7ad',
        padding: 0
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
};

var styles = {
    container:
    {
        width: '100%',
        height: '100%'
    }
};
