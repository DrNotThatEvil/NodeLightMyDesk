const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const RGBControl = global.rgbcontrol;


module.exports = (app) => {
  router.get('/checkinstall', (req, res) => {
    res.json({ installed: fs.existsSync(path.join(global.appRoot, 'config', 'rgbconfig.json')) });
  });

  router.post('/setchiptype', (req, res) => {
    if(!('chiptype' in req.body))
    {
      res.json({ data: [], errors: [{
        error: 'MissingParameter',
        errorStr: 'Missing chiptype paramater'
      }]});
      return;
    }

    RGBControl.setChipType(req.body.chiptype);
    res.json({ data: [{ set: true, value: req.body.chiptype }], errors: []});
  });

  router.post('/setcolormap', (req, res) => {
    if(!('colormap' in req.body))
    {
      res.json({ data: [], errors: [{
        error: 'MissingParameter',
        errorStr: 'Missing devicename paramater'
      }]});
      return;
    }

    RGBControl.setColorMap(req.body.colormap);
    res.json({ data: [{ set: true, value: req.body.colormap }], errors: []});
  });

  router.get('/save', (req, res) => {
    if(!RGBControl.checkDeviceReady())
    {
      res.json({ data: [], errors: [{
        error: 'RGBControlNotReady',
        errorStr: 'RGBControl is not yet ready!'
      }]});
      return;
    }

    let status = RGBControl.saveConfig();
    res.json({ data: [{ status: status }], errors: []});
  });

  router.post('/setdevicename', (req, res) => {
    if(!('devicename' in req.body))
    {
      res.json({ data: [], errors: [{
        error: 'MissingParameter',
        errorStr: 'Missing devicename paramater'
      }]});
      return;
    }

    RGBControl.setDeviceName(req.body.devicename);
    res.json({ data: [{ set: true, value: req.body.devicename }], errors: []});
  });

  router.post('/setnumleds', (req, res) => {
    if(!('numleds' in req.body))
    {
      res.json({ data: [], errors: [{
        error: 'MissingParameter',
        errorStr: 'Missing numleds paramater'
      }]});
      return;
    }

    RGBControl.setNumLeds(req.body.numleds);
    res.json({ data: [{ set: true, value: req.body.numleds}], errors: []});
  });

  router.get('/pulsewhite', (req, res) => {
    if(!RGBControl.checkDeviceReady())
    {
      res.json({ data: [], errors: [{
        error: 'RGBControlNotReady',
        errorStr: 'RGBControl is not yet ready!'
      }]});
      return;
    }

    RGBControl.newJob('fadein', {color: [255, 255,255], delay: 5});
    RGBControl.newJob('fadeout', {color: [255, 255,255], delay: 5});

    res.json({ data: [{ set: true }], errors: []});
  });

  router.get('/clearjobs', (req, res) => {
    if(!RGBControl.checkDeviceReady())
    {
      res.json({ data: [], errors: [{
        error: 'RGBControlNotReady',
        errorStr: 'RGBControl is not yet ready!'
      }]});
      return;
    }

    RGBControl.clearJobs();

    res.json({ data: [{ set: true }], errors: []});
  });

  router.post('/pulse', (req, res) => {
    if(!RGBControl.checkDeviceReady())
    {
      res.json({ data: [], errors: [{
        error: 'RGBControlNotReady',
        errorStr: 'RGBControl is not yet ready!'
      }]});
      return;
    }

    if(!('color' in req.body))
    {
      res.json({ data: [], errors: [{
        error: 'MissingParameter',
        errorStr: 'Missing color paramater'
      }]});
      return;
    }

    RGBControl.newJob('fadein', {color: req.body.color, delay: 5, translate: false});
    RGBControl.newJob('fadeout', {color: req.body.color, delay: 5, translate: false});

    res.json({ data: [{ set: true }], errors: []});
  });

  app.use('/install', router);
};
