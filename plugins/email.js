'use strict';

const fs = require('fs');
const express = require('express');
const path = require('path');
const SimpleImap = require('simple-imap');

const RGBControl = global.rgbcontrol;

let status = false;
let imapClient;
let newEmailCount = 0;

let config = {
  emailServer: '',
  emailPort: '',
  emailAddress: '',
  emailPassword: '',
  emailImportant: ''
};

function canConnectToImap()
{
  if(!('emailServer' in config))
  {
    return false;
  }

  if(config.emailServer.trim() == '')
  {
    return false;
  }

  if(!('emailPort' in config))
  {
    return false;
  }

  if(config.emailPort.trim() == '')
  {
    return false;
  }

  if(!('emailAddress' in config))
  {
    return false;
  }

  if(config.emailAddress.trim() == '')
  {
    return false;
  }

  if(!('emailPassword' in config))
  {
    return false;
  }

  if(config.emailPassword.trim() == '')
  {
    return false;
  }

  return true;
}

function notifyLedstrip(important)
{
  let curColor = RGBControl.getColor();
  let color = ((important || false) ? [255, 0, 0] : [0, 0, 255]);

  RGBControl.newJob('fadeout', {color: [curColor[0], curColor[1], curColor[2]], delay: 2, translate: true});
  RGBControl.newJob('fadein', {color: color, delay: 2, translate: true});
  RGBControl.newJob('fadeout', {color: color, delay: 2, translate: true});
  RGBControl.newJob('fadein', {color: [curColor[0], curColor[1], curColor[2]], delay: 2, translate: true});
  RGBControl.newJob('steadycolor', {color: [curColor[0], curColor[1], curColor[2]], translate: true}, {repeat: true});
}

function connectToImap()
{
  if(!canConnectToImap())
    return;

  let imapConfig = {
    user: config.emailAddress,
    password: config.emailPassword,
    host: config.emailServer,
    port: config.emailPort,
    tls: {
      secureProtocol: 'TLSv1_method'
    },
    mailbox: 'INBOX',
    authTimeout: 15000,
    connectTimeout: 30000
  };

  imapClient = new SimpleImap(imapConfig);

  //imapClient.on('error', (err) => {
  //  console.log(err);
  //  console.log('Retrying connection in 7 seconds');

  //  setTimeout(function() { connectToImap() }, 7000);
  //});

  imapClient.on('mail', (mail) => {

    //console.log(mail);
    let foundImportant = false;
    let split = config.emailImportant.split(',');
    split.forEach((val) => {
      let nVal = val.trim().toLowerCase();

      mail.from.forEach((from) => {
        if(from.address.toLowerCase().indexOf(nVal) != -1)
        {
          foundImportant = true;
        }

        if(from.name.toLowerCase().indexOf(nVal) != -1)
        {
          foundImportant = true;
        }
      });

      if(mail.subject.toLowerCase().indexOf(nVal) != -1)
      {
        foundImportant = true;
      }
    });

    if(!foundImportant)
    {
      if(status)
      {
        notifyLedstrip(false);
        newEmailCount = 0; //Reset the email count cause we notified the user.
      }
      else
      {
        newEmailCount++;
      }
    }
    else
    {
      notifyLedstrip(true);
    }
  });

  imapClient.on('error', (err) => {
    console.log('Imap error:', err);
  });

  imapClient.on('end', () => {
    console.log('end');
  });

  imapClient.start();
}

function loadData()
{
  let configFile = path.join(__dirname, 'email', 'config', 'emailconfig.json');
  if(fs.existsSync(configFile))
  {
    config = require(configFile);
  }
}

function setData(setconfig)
{
  config = setconfig;

  let configFile = path.join(__dirname, 'email', 'config', 'emailconfig.json');
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

  connectToImap();
}

function addRoutes(router)
{
  router.use('/emailstatic', express.static(path.join(__dirname, 'email', 'static')));

  router.get('/getemaildata', (req, res) => {
    res.json({ data: [config], errors: []});
  });

  router.post('/setemaildata', (req, res) => {
    if(!('config' in req.body))
    {
      res.json({ data: [], errors: [{
        error: 'MissingParameter',
        errorStr: 'Missing config paramater'
      }]});
      return;
    }

    if(!('emailServer' in req.body.config))
    {
      res.json({ data: [], errors: [{
        error: 'MissingConfigParameter',
        errorStr: 'Missing emailServer in config'
      }]});
      return;
    }

    if(!('emailPort' in req.body.config))
    {
      res.json({ data: [], errors: [{
        error: 'MissingConfigParameter',
        errorStr: 'Missing emailPort in config'
      }]});
      return;
    }

    if(!('emailAddress' in req.body.config))
    {
      res.json({ data: [], errors: [{
        error: 'MissingConfigParameter',
        errorStr: 'Missing emailAddress in config'
      }]});
      return;
    }

    if(!('emailPassword' in req.body.config))
    {
      res.json({ data: [], errors: [{
        error: 'MissingConfigParameter',
        errorStr: 'Missing emailPassword in config'
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

  if(val && newEmailCount > 0)
  {
    notifyLedstrip(false);
    newEmailCount = 0;
  }
}

function getStatus()
{
  return status;
}

function getSidebarData()
{
  return {
    id: 'email',
    name: 'Email Plugin',
    url: '/plugin/email/emailstatic/',
    apiurl: '/plugin/email/',
    status: status
  };
}

function initPlugin()
{
  loadData();
  connectToImap();
}

module.exports = function(module_holder) {
  // the key in this dictionary can be whatever you want
  // just make sure it won't override other modules
  module_holder['email'] = {
    addRoutes: addRoutes,
    setStatus: setStatus,
    getStatus: getStatus,
    getSidebarData: getSidebarData,
    initPlugin: initPlugin
  };
};
