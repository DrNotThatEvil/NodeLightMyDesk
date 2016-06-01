import React from 'react';
import Radium from 'radium';
import Color from 'color';
import { withRouter } from 'react-router';

import SidebarStyle from './SidebarStyle';

class SidebarItem extends React.Component {
    static propTypes = {
        handleClick: React.PropTypes.func,
        children: React.PropTypes.node,
        url: React.PropTypes.string,
        icon: React.PropTypes.string,
        iconimage: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        router: React.PropTypes.object
    };

    constructor(props)
    {
        super(props);

        this.state = { collapsed: true, hideTimeout: false };
    }

    getChildContext()
    {
        return {
            isChild: true,
            parentCollapsed: this.state.collapsed
        };
    }

    handleClick(e)
    {
        if(!this.props.handleClick)
        {
            e.stopPropagation();
            e.preventDefault();
        }

        if(React.Children.count(this.props.children) > 0)
        {
            let collapsed = !this.state.collapsed;
            if(collapsed)
            {
                setTimeout(() => {
                    this.setState({hideTimeout: false});
                }, 505);
            }
            else
            {
                this.setState({hideTimeout: true});
            }
            this.setState({
                collapsed: collapsed
            });
        }

        if(this.props.handleClick)
        {
            this.props.handleClick(e);
        }
        else
        {
            if(this.props.url)
            {
                e.stopPropagation();
                this.props.router.push(this.props.url);
            }
        }
    }

    render()
    {
        let titleState = (Radium.getState(this.state, 'sidebaritem', ':hover') ? {
            paddingLeft: 5,
            color: Color(SidebarStyle.font).lighten(0.6).hexString()
        } : {});

        let expanded = {
            backgroundColor: Color(SidebarStyle.menuBg).darken(0.2).hexString(),
            maxHeight: (this.state.collapsed ? 45 : 500 ),
            borderLeft: '2px solid ' + Color(SidebarStyle.menuBg).darken(0.5).hexString(),
            width: 'calc(100% - 2px)'
        };

        expanded = (!this.state.collapsed ? expanded : styles.base);
        expanded = ((this.context.isChild && !this.context.parentCollapsed) ? [expanded, styles.base] : expanded);
        let children = (this.state.collapsed && !this.state.hideTimeout ? '' : this.props.children);

        let icon = ( React.Children.count(this.props.children) > 0 ? 'fa fa-chevron-' + (this.state.collapsed ? 'down' : 'up') : this.props.icon );
        let iconElement = ( icon ? <i className={icon} style={[styles.icon]} aria-hidden="true"></i> : '' );
        iconElement = ( this.props.iconimage ? <img style={[styles.iconimage]} src={this.props.iconimage} />: iconElement );

        return (
            <div key="sidebaritem" style={[SidebarStyle.bmListItem.base, expanded]} onClick={this.handleClick.bind(this)}>
                <div ref="sidebartitle" style={[styles.title, titleState]}>
                    {this.props.title}
                </div>
                { iconElement }
                { children }
            </div>
        );
    }
}
SidebarItem.contextTypes = {
    isChild: React.PropTypes.bool,
    parentCollapsed: React.PropTypes.bool
};
SidebarItem.childContextTypes = {
    isChild: React.PropTypes.bool,
    parentCollapsed: React.PropTypes.bool
};

var styles = {
    base: {
        ':hover':
        {
            backgroundColor: SidebarStyle.menuActive,
            borderLeft: '4px solid ' + Color(SidebarStyle.menuActive).darken(0.3).hexString()
        }
    },
    title:
    {
        display: 'inline-block',
        fontFamily: 'cabinbold',
        color: SidebarStyle.font,
        fontSize: 20,
        marginLeft: 10,
        paddingTop: '0.5em',
        paddingBottom: '0.5em',
        transition: '0.2s'
    },
    icon: {
        color: SidebarStyle.font,
        float: 'right',
        marginTop: '.75em',
        marginRight: '.75em'
    },
    iconimage:
    {
        display: 'inline-block',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50%',
        borderRadius: '50%',
        width: 30,
        height: 30,
        marginRight: 10,
        float: 'right',
        backgroundColor: Color(SidebarStyle.menuBg).lighten(0.10).hexString(),
        border: '1px solid ' + Color(SidebarStyle.menuBg).darken(0.05).hexString(),
        marginTop: '.25em'
    }
};

export default withRouter(Radium(SidebarItem));
