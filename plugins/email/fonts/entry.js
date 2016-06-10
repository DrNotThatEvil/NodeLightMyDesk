'use strict';

require('../fonts/font-awesome.min.css');

import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { StyleRoot } from 'radium';
import tickflowApp from './reducers';

import Routes from './components/Routes';

let store = createStore(tickflowApp);

ReactDom.render(
    (<Provider store={store}>
        <StyleRoot>
            <Routes />
        </StyleRoot>
    </Provider>),
    document.getElementById('app')
);
