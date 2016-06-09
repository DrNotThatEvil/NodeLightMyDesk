import React from 'react';
import Radium from 'radium';
import Color from 'color';
import ReactSlider from 'react-slider';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import dashboardActions from '../../actions/dashboardActions';

import SidebarStyle from './SidebarStyle';
import ViewsCommonStyle from '../Views/ViewsCommonStyle';

class ColorStateItem extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {
            status: this.props.server.status,
            color: [
                this.props.server.color[0],
                this.props.server.color[1],
                this.props.server.color[2]
            ]
        };
    }

    componentDidMount()
    {
        this.props.fetchStatus((value) => {
            this.setState({
                status: value
            });
        });

        this.props.fetchColor((value) => {
            this.setState({
                color: value
            });
        });
    }

    onSliderChange()
    {
        this.setState({
            color: [
                this.refs.red.getValue(),
                this.refs.green.getValue(),
                this.refs.blue.getValue()
            ]
        });
    }

    onSliderDone()
    {
        // lets update that color shall we ?
        this.props.syncSetColor(this.state.color, () => {
            console.log('COLOR SET');
        })
    }

    setStatus(status)
    {
        return () => {
            this.setState({
                status: status
            }, () => {
                this.props.syncSetStatus(this.state.status, () => {});
            });

            if(!status)
            {
                if(this.props.onOffClick)
                    this.props.onOffClick();
            }
        };
    }

    render()
    {
        let color = Color({r: this.state.color[0], g: this.state.color[1], b: this.state.color[2]}).hexString();

        let colorStyle = {
            backgroundColor: (this.state.status ? color : '#000000'),
            border: '1px solid ' + Color((this.state.status ? color : '#000000')).darken(0.5).hexString()
        };

        return (
            <div ref="colorstateitem" style={[SidebarStyle.bmListItem.base, styles.personal]}>
                <div ref="colorbox" style={[styles.colorbox, colorStyle]}></div>
                <div style={[{ width: 165, marginLeft: 95 }]}>
                    <ReactSlider ref="red" onChange={this.onSliderChange.bind(this)} onAfterChange={this.onSliderDone.bind(this)} min={0} max={255} value={this.state.color[0]} barClassName="bar-red" withBars />
                    <ReactSlider ref="green" onChange={this.onSliderChange.bind(this)} onAfterChange={this.onSliderDone.bind(this)} min={0} max={255} value={this.state.color[1]} barClassName="bar-green" withBars />
                    <ReactSlider ref="blue" onChange={this.onSliderChange.bind(this)} onAfterChange={this.onSliderDone.bind(this)} min={0} max={255} value={this.state.color[2]} barClassName="bar-blue" withBars />
                </div>
                <div>
                    <input key="on" type="button" onClick={this.setStatus.bind(this)(true)} style={[ViewsCommonStyle.base, ViewsCommonStyle.submit, styles.on, (this.state.status ? styles.disabled : {})]} value="ON" />
                    <input key="off" type="button" onClick={this.setStatus.bind(this)(false)} style={[ViewsCommonStyle.base, ViewsCommonStyle.submit, styles.on, styles.off, (!this.state.status ? styles.disabled : {})]} value="OFF" />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchStatus: dashboardActions.fetchStatus,
        fetchColor: dashboardActions.fetchColor,
        syncSetColor: dashboardActions.syncSetColor,
        syncSetStatus: dashboardActions.syncSetStatus
    }, dispatch);
};

const mapStateToProps = (state) => {
    return { server: state.server };
};

const VisibleColorStateItem = connect(
    mapStateToProps,
    mapDispatchToProps
)(Radium(ColorStateItem));

export default VisibleColorStateItem;

var styles = {
    personal:
    {
        maxHeight: 150,
        height: 150,
        padding: '10px 0px 0px 0px',
        borderBottom: 'none'
    },
    colorbox:
    {
        display: 'inline-block',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50%',
        borderRadius: 15,
        width: 75,
        height: 75,
        marginLeft: 10,
        float: 'left',
        transition: 'background-color 0.5s linear'
    },
    on:
    {
        display: 'inline-block',
        width: '40%',
        height: 50,
        borderRadius: 15,
        marginLeft: 15,
        marginTop: 5,
        fontFamily: 'cabinbold'
    },
    off:
    {
        backgroundColor: '#cc2e3a',
        color: '#8e2028',
        ':hover':
        {
            color: '#cc2e3a',
            backgroundColor: '#a2252e'
        }
    },
    disabled:
    {
        backgroundColor: '#5f5f5f',
        color: Color('#5f5f5f').darken(0.5).hexString(),
        ':hover':
        {
            color: Color('#5f5f5f').darken(0.5).hexString(),
            backgroundColor: '#5f5f5f'
        }
    }
};
