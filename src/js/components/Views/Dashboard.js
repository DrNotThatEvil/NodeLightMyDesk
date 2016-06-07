import React from 'react';
import Radium from 'radium';
import Sidebar from '../Sidebar/Sidebar';

class Dashboard extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            currentPlugin: '/'
        };
    }

    pluginClicked(e)
    {
        this.setState({
            currentPlugin: '/plugin/test_module/'
        });
    }

    render()
    {
        return (
            <div className="container" style={[{
                width: '100%',
                height: '100%'
            }]}>
                <Sidebar pluginClicked={ this.pluginClicked.bind(this) }/>
                <div style={[{
                    width: '100%',
                    height: '100%'
                }]}>
                </div>
            </div>
        );
    }
}
export default Radium(Dashboard);
