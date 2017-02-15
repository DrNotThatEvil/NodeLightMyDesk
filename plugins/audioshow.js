'use strict';

const fs = require('fs');
const express = require('express');
const path = require('path');

const RGBControl = global.rgbcontrol;

let status = false;

let config = {
  soundcloudApi: ''
};

function loadData()
{
  let configFile = path.join(__dirname, 'audioshow', 'config', 'audioshowconfig.json');
  if(fs.existsSync(configFile))
  {
    config = require(configFile);
  }
}

function setData(setconfig)
{
  config = setconfig;

  let configFile = path.join(__dirname, 'audioshow', 'config', 'audioshowconfig.json');
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
  router.use('/audioshowstatic', express.static(path.join(__dirname, 'audioshow', 'static')));

  router.get('/getaudioshowdata', (req, res) => {
    res.json({ data: [config], errors: []});
  });

  router.post('/setaudioshowdata', (req, res) => {
    if(!('config' in req.body))
    {
      res.json({ data: [], errors: [{
        error: 'MissingParameter',
        errorStr: 'Missing config paramater'
      }]});
      return;
    }

    if(!('soundcloudApi' in req.body.config))
    {
      res.json({ data: [], errors: [{
        error: 'MissingConfigParameter',
        errorStr: 'Missing soundcloudApi in config'
      }]});
      return;
    }

    setData(req.body.config);
    res.json({ data: [{ set: true, value: config }], errors: []});
  });
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
    id: 'audioshow',
    name: 'Audioshow Plugin',
    url: '/plugin/audioshow/audioshowstatic/',
    apiurl: '/plugin/audioshow/',
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
  module_holder['audioshow'] = {
    addRoutes: addRoutes,
    setStatus: setStatus,
    getStatus: getStatus,
    getSidebarData: getSidebarData,
    initPlugin: initPlugin
  };
};
