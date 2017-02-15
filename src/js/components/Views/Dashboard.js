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
    e.preventDefault();
    e.stopPropagation();

    return (url) => {
      this.setState({
        currentPlugin: url
      });
    };
  }

  render()
  {
    let frame = this.state.currentPlugin != '/' ? (<iframe style={[{
      width: '100%',
      height: '100%'
    }]} frameBorder="0" src={this.state.currentPlugin}></iframe>) : null;

    return (
      <div className="container" style={[{
        width: '100%',
        height: '100%',
        display: 'flex'
      }]}>
        <Sidebar pluginClicked={ this.pluginClicked.bind(this) }/>
        <div style={[{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          paddingLeft: 264,
          paddingTop: 0
        }]}>
          {frame}
        </div>
      </div>
    );
  }
}
export default Radium(Dashboard);
