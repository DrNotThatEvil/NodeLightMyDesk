'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import { StyleRoot } from 'radium';

import BeamProInterface from './components/Views/BeamProInterface';

require('../css/font-awesome.min.css');
require('../css/main.css');

ReactDom.render(
    (
        <StyleRoot style={[{margin: 0, width: '100%', height: '100%'}]}>
            <BeamProInterface />
        </StyleRoot>
    ),
    document.getElementById('app')
);
