import React from 'react';
import Radium from 'radium';
import Color from 'color';
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

    render()
    {
        return (
            <div style={[styles.base]}>
                <div style={[styles.container]}>
                    <div style={[styles.header]}>
                        <span>Ledstrip installation: Configure chiptype</span>
                    </div>
                    <div style={[styles.content]}>
                        <div>
                            Hello welcome!<br />
                            Its time to configure your awesome ledstrip!<br />
                            First we need to know what kind of chip your led uses<br />
                            Please select a chiptype below: <br />
                            <div style={[{ marginTop: 10, color: 'red' }]}>
                                {this.props.errors.map(function(result) {
                                    return <span>{result.errorStr}<br /></span>;
                                })}
                            </div>
                            <div style={[{ marginTop: 100 }]}>
                                <input key="lpd6803" type="button" style={[ViewsCommonStyle.base, ViewsCommonStyle.submit]} value="LPD6803" onClick={this.sendChip.bind(this)('LPD6803')}/>
                                <input key="other_btn" type="button" style={[ViewsCommonStyle.base, ViewsCommonStyle.submit, ViewsCommonStyle.submitDisabled]} value="More types soon.." />
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
        setChipTypeAsync: serverActions.setChipTypeAsync
    }, dispatch);
};

const mapStateToProps = (state) => {
    return { errors: state.server.errors };
};
const VisibleInstall = connect(
    mapStateToProps,
    mapDispatchToProps
)(Radium(Install));

export default VisibleInstall;
