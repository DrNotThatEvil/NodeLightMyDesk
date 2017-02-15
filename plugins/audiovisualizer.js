'use strict';

const fs = require('fs');
const express = require('express');
const path = require('path');
const SimpleImap = require('simple-imap');

const RGBControl = global.rgbcontrol;

let status = false;

let config = {
  emailServer: '',
  emailPort: '',
  emailAddress: '',
  emailPassword: '',
  emailImportant: ''
};

function loadData()
{
  let configFile = path.join(__dirname, 'audiovisualizer', 'config', 'visualizer.json');
  if(fs.existsSync(configFile))
  {
    config = require(configFile);
  }
}

function setData(setconfig)
{
  config = setconfig;

  let configFile = path.join(__dirname, 'audiovisualizer', 'config', 'visualizer.json');
  try
  {
    fs.writeFileSync(configFile, JSON.stringify(config, null, 4), {}, () => {
    //if(err)
    //  console.log(err);
    });
  }
  catch(e)
  {
    return false;
  }
}

function addRoutes(router)
{
  router.use('/visualizerstatic', express.static(path.join(__dirname, 'audiovisualizer', 'static')));
}

function setStatus(val)
{
  status = val;
}

function getStatus()
{
  return status;
}

function getSidebarData()
{
  return {
    id: 'audiovisualzer',
    name: 'Audio Visualizer',
    url: '/plugin/audiovisualizer/visualizerstatic/',
    apiurl: '/plugin/audiovisualizer/',
    status: status
  };
}

function initPlugin()
{
  loadData();
}

module.exports = function(module_holder) {
  // the key in this dictionary can be whatever you want
  // just make sure it won't override other modules
  module_holder['auidovisualizer'] = {
    addRoutes: addRoutes,
    setStatus: setStatus,
    getStatus: getStatus,
    getSidebarData: getSidebarData,
    initPlugin: initPlugin
  };
};
