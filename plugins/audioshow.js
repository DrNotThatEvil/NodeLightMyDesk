'use strict';

const fs = require('fs');
const express = require('express');
const path = require('path');

const RGBControl = global.rgbcontrol;

const WebSocketServer = require('ws').Server
 , wss = new WebSocketServer({ port: 8801 });

let status = false;

function isSaveLedData(json) {
  if(!('leds' in json))
  {
    return false;
  }

  if(json.leds.length != RGBControl.getNumLeds()) 
  {
    return false;
  }

  return true;
}


wss.on('connection', function(ws) {
  ws.on('error', function (e) {
    console.log('Client #%d error: %s', thisId, e.message);
  });

  ws.on('message', function(data, flags) {
    if(!status) {
      return;
    }

    try {
      let ledData = JSON.parse(data); 

      if(isSaveLedData(ledData)) {
        //console.log('AudioShow led data safe');

        ledData.leds.forEach((part, index) => {
          let g = ledData.leds[index][1];
          g = g - ( g * (g/220) );
          ledData.leds[index][1] = g;

          ledData.leds[index].push(0);
        });

        RGBControl.newJob('arraysteadycolor', {leds: ledData.leds, translate: true}, {repeat: false});
      } else {
        //console.log('AudioShow led data unsafe.');
      }
    } catch (e) {
      console.log('Could not decode audioshow json data');
    }
  });
});

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

  router.get('/testLoopy', (req, res) => {
    let leds = [];
    for(let i=0; i<RGBControl.getNumLeds(); i++) {
      let ledArray = [];
      for(let j=0; j<3; j++) {
        ledArray.push((Math.floor(Math.random() * 255)));
      }
      leds.push(ledArray);
    }

    RGBControl.newJob('arraysteadycolor', {leds: leds, translate: true}, {repeat: false});
    res.json({ data: [{ set: true, value: true }], errors: []});
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
