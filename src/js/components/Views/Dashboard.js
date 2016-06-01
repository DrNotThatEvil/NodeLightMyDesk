import React from 'react';
import Radium from 'radium';
import Sidebar from '../Sidebar/Sidebar';

class Dashboard extends React.Component {
    constructor(props)
    {
        super(props);
    }
    render()
    {
        return (
            <div className="container">
                <Sidebar />
            </div>
        );
    }
}
export default Radium(Dashboard);
