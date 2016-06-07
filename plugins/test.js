'use strict';

const express = require('express');
const path = require('path');

function addRoutes(router) {
    router.use(express.static(path.join(__dirname, 'test', 'static')));
}

module.exports = function(module_holder) {
    // the key in this dictionary can be whatever you want
    // just make sure it won't override other modules
    module_holder['test_module'] = {
        addRoutes: addRoutes
    };
};
