import React from 'react';
import Radium from 'radium';
import Color from 'color';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import serverActions from '../../actions/serverActions';
import { withRouter } from 'react-router';

import ViewsCommonStyle from './ViewsCommonStyle';

class Install extends React.Component {
    static propTypes = {
        server: React.PropTypes.object.isRequired
    };

    constructor(props)
    {
        super(props);
        this.state = {
            pulseColor: [255, 255, 255],
            colorMapPos: 'r',
            colorMapped: false,
            colorMap: {
                r: 'r',
                g: 'g',
                b: 'b'
            }
        };
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
            this.props.startPulse([255, 255, 255]);
            this.pulseInterval = setInterval(this.pulseTimer.bind(this), 1500);
        };
    }

    buildColorMap(color)
    {
        return () => {
            let newColorMap = this.state.colorMap;
            newColorMap[this.state.colorMapPos] = color;

            let pulseColor = [255, 255, 255];
            if(this.state.colorMapPos == 'r')
            {
                pulseColor = [0, 255, 0];
            }
            else
            {
                pulseColor = [0, 0, 255];
            }

            this.setState({
                colorMap: newColorMap,
                colorMapPos: (this.state.colorMapPos == 'r' ? 'g' : 'b'),
                pulseColor: pulseColor,
                colorMapped: (this.state.colorMapPos == 'b')
            });

            if(this.state.colorMapPos == 'b')
            {
                this.props.setColorMapAsync(this.state.colorMap, () => {

                    this.props.saveConfig(() => {
                        setTimeout(function () {
                            location.reload();
                        }, 5000);
                    });
                });
            }
        };
    }

    ajustLength(value)
    {
        return () => {
            let newval = (this.props.server.ledlength + value);
            if(newval < 1)
                newval = 1;

            this.props.setNumLedsAsync(newval);
        };
    }

    lockLength()
    {
        this.props.setLedLengthLock(true);
        this.setState({
            pulseColor: [255, 0 , 0]
        });
    }

    pulseTimer(data)
    {
        // do something with the data
        let shouldpulse = ('spidevtype' in this.props.server ? (this.props.server.ledlengthlock ?  false : true) : false);

        //console.log('PULSE: ', (data.type == 'fadeout' && (shouldpulse || !this.state.colorMapped)));

        if((shouldpulse || !this.state.colorMapped))
        {
            this.props.startPulse(this.state.pulseColor);
        }
        else if(!(shouldpulse || !this.state.colorMapped))
        {
            clearInterval(this.pulseInterval);
        }
    }

    render()
    {
        let page1 = {
            display: ('chiptype' in this.props.server ? 'none' : 'flex')
        };

        let page2 = {
            display: ('chiptype' in this.props.server ? ('spidevtype' in this.props.server ?  'none' : 'flex') : 'none')
        };

        let page3 = {
            display: ('spidevtype' in this.props.server ? (this.props.server.ledlengthlock ?  'none' : 'flex') : 'none')
        };

        let page4 = {
            display: (this.props.server.ledlengthlock ?  (this.state.colorMapped ? 'none' : 'flex') : 'none')
        };

        let page5 = {
            display: (this.state.colorMapped ? 'flex' : 'none')
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
        new_uri += '//' + loc.hostname + ':8880';

        return (
            <div style={[styles.base]}>
                <div style={[styles.container]}>
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
                        <div key="page3" style={[styles.page, page3]}>
                            Now we just need to figure out the length of your ledstrip.<br />
                            Just use the buttons below to adjust your ledstrip length<br />
                            <div style={[{ marginTop: 50 }]}>
                                <input key="<<" type="button" style={[ViewsCommonStyle.base, styles.circlebtn]} value="-10" onClick={this.ajustLength.bind(this)(-10)}/>
                                <input key="<" type="button" style={[ViewsCommonStyle.base, styles.circlebtn]} value="-1" onClick={this.ajustLength.bind(this)(-1)}/>
                                <input key="length" type="button" style={[ViewsCommonStyle.base, styles.circlebtn, ViewsCommonStyle.submitDisabled]} value={this.props.server.ledlength} />
                                <input key=">" type="button" style={[ViewsCommonStyle.base, styles.circlebtn]} value="+1" onClick={this.ajustLength.bind(this)(1)}/>
                                <input key=">>" type="button" style={[ViewsCommonStyle.base, styles.circlebtn]} value="+10" onClick={this.ajustLength.bind(this)(10)}/>
                            </div>
                            <div style={[{ marginTop: 25 }]}>
                                <input key="setlength" type="button" style={[ViewsCommonStyle.base, ViewsCommonStyle.submit]} value="Lock length" onClick={this.lockLength.bind(this)}/>
                            </div>
                        </div>
                        <div key="page4" style={[styles.page, page4]}>
                            Almost done!<br />
                            Now we need to configure the colors of your ledstrip<br />
                            Some ledstrips use different color mappings<br />
                            by using this wizard we will make sure colors are correct<br />
                            <br />
                            We will show different colors on your ledstrip just select the color you see below<br />
                            <div style={[{ marginTop: 25 }]}>
                                <input key="red" type="button" style={[ViewsCommonStyle.base, ViewsCommonStyle.submit, styles.red]} value="Red" onClick={this.buildColorMap.bind(this)('r')} />
                                <input key="green" type="button" style={[ViewsCommonStyle.base, ViewsCommonStyle.submit]} value="Green" onClick={this.buildColorMap.bind(this)('g')} />
                                <input key="blue" type="button" style={[ViewsCommonStyle.base, ViewsCommonStyle.submit, styles.blue]} value="Blue" onClick={this.buildColorMap.bind(this)('b')} />
                            </div>
                        </div>
                        <div key="page5" style={[styles.page, page5]}>
                            We are done here!<br /><br />
                            Please wait while we save your configuration and perform some setup<br />
                            <i>Please note: some plugins may require some extra configuration<br /><br /></i>

                            <img style={[{ display: 'block',  marginTop: 25, marginBottom: 25}]} src={require('../../../imgs/loader.svg')} />
                            <span style={[{ display: 'block', marginTop: 50}]}>
                            Created with <i className="fa fa-heart" style={[{ color: '#d44095' }]} aria-hidden="true"></i> by Dr.NotThatEvil.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setChipTypeAsync: serverActions.setChipTypeAsync,
        setSpiDevAsync: serverActions.setSpiDevAsync,
        startPulse: serverActions.startPulse,
        setNumLedsAsync: serverActions.setNumLedsAsync,
        setLedLengthLock: serverActions.setLedLengthLock,
        setColorMapAsync: serverActions.setColorMapAsync,
        saveConfig: serverActions.saveConfig
    }, dispatch);
};

const mapStateToProps = (state) => {
    return { server: state.server };
};
const VisibleInstall = connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Radium(Install)));

export default VisibleInstall;

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
        transition: 'opacity 0.5s linear',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
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
    },
    red:
    {
        backgroundColor: '#cc2e3a',
        ':active': {
            backgroundColor: '#b72934'
        },
        ':hover': {
            backgroundColor: '#b72934'
        }
    },
    blue:
    {
        backgroundColor: '#2e89cc',
        ':active': {
            backgroundColor: '#297bb7'
        },
        ':hover': {
            backgroundColor: '#297bb7'
        }
    },
    circlebtn:
    {
        display: 'inline-block',
        backgroundColor: '#2ecc71',
        border: 0,
        padding: 0,
        fontSize: 20,
        width: 75,
        height: 75,
        borderRadius: '50%',
        margin: '0px 0px 0px 25px',
        cursor: 'pointer',
        ':active': {
            backgroundColor: '#27ae60'
        },
        ':hover': {
            backgroundColor: '#27ae60'
        }
    }
};
