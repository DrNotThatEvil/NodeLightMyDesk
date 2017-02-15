'use strict';

const express = require('express');
const router = express.Router();
const RGBControl = global.rgbcontrol;

let preShutdown = [0, 0, 0];

module.exports = (app) => {
  router.get('/getcolor', (req, res) => {
    let color = RGBControl.getColor();
    res.json({ data: [{ set: true, value: color }], errors: []});
  });

  router.post('/setcolor', (req, res) => {
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

    let curColor = RGBControl.getColor();
    RGBControl.newJob('fadeout', {color: [curColor[0], curColor[1], curColor[2]], delay: 5, translate: true});
    RGBControl.newJob('fadein', {color: req.body.color, delay: 5, translate: true});
    RGBControl.newJob('steadycolor', {color: req.body.color, translate: true}, {repeat: true});

    res.json({ data: [{ set: true, value: req.body.color}], errors: []});
  });

  router.get('/getstatus', (req, res) => {
    let status = RGBControl.getStatus();
    res.json({ data: [{ set: true, value: status }], errors: []});
  });

  router.post('/setstatus', (req, res) => {
    if(!('status' in req.body))
    {
      res.json({ data: [], errors: [{
        error: 'MissingParameter',
        errorStr: 'Missing color paramater'
      }]});
      return;
    }

    let curColor = RGBControl.getColor();
    if(req.body.status == false)
    {
      preShutdown = curColor;
      RGBControl.newJob('fadeout', {color: [curColor[0], curColor[1], curColor[2]], delay: 5, translate: true});
      RGBControl.newJob('steadycolor', {color: [0, 0, 0], translate: true}, {repeat: true});
      RGBControl.setStatus(req.body.status);
    }
    else
    {
      RGBControl.setStatus(req.body.status);
      RGBControl.newJob('fadein', {color: [preShutdown[0], preShutdown[1], preShutdown[2]], delay: 5, translate: true});
      RGBControl.newJob('steadycolor', {color: [preShutdown[0], preShutdown[1], preShutdown[2]], translate: true}, {repeat: true});
    }

    res.json({ data: [{ set: true, value: req.body.status}], errors: []});
  });

  app.use('/dashboard', router);
};
