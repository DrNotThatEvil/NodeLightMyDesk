'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import { StyleRoot } from 'radium';

import Routes from './components/Routes';

//require('../css/font-awesome.min.css');
//require('../css/main.css');

ReactDom.render(
    (
        <StyleRoot style={[{margin: 0, width: '100%', height: '100%'}]}>
            <Routes />
        </StyleRoot>
    ),
    document.getElementById('app')
);
