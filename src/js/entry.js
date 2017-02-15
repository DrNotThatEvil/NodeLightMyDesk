'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import { StyleRoot } from 'radium';
import configureStore from './store';
import { Provider } from 'react-redux';
import Routes from './components/Routes';

require('../css/font-awesome.min.css');
require('../css/main.css');

//import serverActions from './actions/serverActions';

const store = configureStore();

//store.dispatch(serverActions.fetchInstalled());

ReactDom.render(
  (
    <Provider store={store}>
      <StyleRoot style={[{margin: 0, width: '100%', height: '100%'}]}>
        <Routes />
      </StyleRoot>
    </Provider>
  ),
  document.getElementById('app')
);
