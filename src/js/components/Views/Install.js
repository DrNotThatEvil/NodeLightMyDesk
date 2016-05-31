import React from 'react';
import Radium from 'radium';
import Color from 'color';
import Websocket from 'react-websocket';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import serverActions from '../../actions/serverActions';

console.log( serverActions );

import ViewsCommonStyle from './ViewsCommonStyle';

class Install extends React.Component {
    constructor(props)
    {
        super(props);
    }

    sendChip(chip)
    {
        return () => {
            this.props.setChipTypeAsync(chip);
        };
    }

    sendDev(dev)
    {
        return () => {
            this.props.setSpiDevAsync(dev);
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
        let page1 = {
            display: ('chiptype' in this.props.server ? 'none' : 'block')
        };

        let page2 = {
            display: ('chiptype' in this.props.server ? ('spidevtype' in this.props.server ?  'none' : 'block') : 'none')
        };

        let page3 = {
            display: ('spidevtype' in this.props.server ? 'block' : 'none')
        };

        let loc = window.location, new_uri;
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
            <div style={[styles.base]}>
                <div style={[styles.container]}>
                    <Websocket url={new_uri} onMessage={this.handleData.bind(this)}/>
                    <div style={[styles.header]}>
                        <span>Ledstrip installation: Configure chiptype</span>
                    </div>
                    <div style={[styles.content]}>
                        <div key="page1" style={[styles.page, page1]}>
                            Hello welcome!<br />
                            Its time to configure your awesome ledstrip!<br />
                            First we need to know what kind of chip your led uses<br />
                            Please select a chiptype below: <br />
                            <div style={[{ marginTop: 10, color: 'red' }]}>
                                {this.props.server.errors.map(function(result) {
                                    return <span>{result.errorStr}<br /></span>;
                                })}
                            </div>
                            <div style={[{ marginTop: 100 }]}>
                                <input key="lpd6803" type="button" style={[ViewsCommonStyle.base, ViewsCommonStyle.submit]} value="LPD6803" onClick={this.sendChip.bind(this)('LPD6803')}/>
                                <input key="other_btn" type="button" style={[ViewsCommonStyle.base, ViewsCommonStyle.submit, ViewsCommonStyle.submitDisabled]} value="More types soon.." />
                            </div>
                        </div>
                        <div key="page2" style={[styles.page, page2]}>
                            Great now we just need to know to what SPI device you connected your ledstrip<br />
                            <div style={[{ marginTop: 10, color: 'red' }]}>
                                {this.props.server.errors.map(function(result) {
                                    return <span>{result.errorStr}<br /></span>;
                                })}
                            </div>
                            <div style={[{ marginTop: 100 }]}>
                                <input key="spidev0.0" type="button" style={[ViewsCommonStyle.base, ViewsCommonStyle.submit]} value="/dev/spidev0.0" onClick={this.sendDev.bind(this)('/dev/spidev0.0')}/>
                                <input key="spidev0.1" type="button" style={[ViewsCommonStyle.base, ViewsCommonStyle.submit]} value="/dev/spidev0.1" onClick={this.sendDev.bind(this)('/dev/spidev0.1')}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

var styles = {
    base :
    {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    container:
    {
        border: '1px solid '+ Color(ViewsCommonStyle.font).darken(0.15).hexString(),
        backgroundColor: Color(ViewsCommonStyle.font).darken(0.02).hexString(),
        width: 800,
        height: 500,
        marginTop: 15,
        borderRadius: 8
    },
    page:
    {
        opacity: 1,
        transition: 'opacity 0.5s linear'
    },
    header:
    {
        fontFamily: 'cabinbold',
        fontSize: 25,
        color: Color(ViewsCommonStyle.font).darken(0.50).hexString(),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        borderBottom: '1px solid '+ Color(ViewsCommonStyle.font).darken(0.15).hexString()
    },
    content:
    {
        fontFamily: 'cabinregular',
        fontSize: 17,
        color: Color(ViewsCommonStyle.font).darken(0.50).hexString(),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: '20px',
        paddingTop: 25,
        textAlign: 'center'
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setChipTypeAsync: serverActions.setChipTypeAsync,
        setSpiDevAsync: serverActions.setSpiDevAsync
    }, dispatch);
};

const mapStateToProps = (state) => {
    return { server: state.server };
};
const VisibleInstall = connect(
    mapStateToProps,
    mapDispatchToProps
)(Radium(Install));

export default VisibleInstall;
