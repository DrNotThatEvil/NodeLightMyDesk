const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
let RGBControl = require('../../lib/RGBControl');


module.exports = (app) => {
    RGBControl = new RGBControl(app);
    require('../../lib/RGBFadeIn')(RGBControl);
    require('../../lib/RGBFadeOut')(RGBControl);

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
        res.json({ data: [{ set: true }], errors: []});
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

        RGBControl.newJob('fadein', 'low', {color: [255, 255,255], delay: 05});
        RGBControl.newJob('fadeout', 'low', {color: [255, 255,255], delay: 05});
        RGBControl.newJob('fadein', 'low', {color: [255, 0,0], delay: 05});
        RGBControl.newJob('fadeout', 'low', {color: [255, 0,0], delay: 05});
        RGBControl.newJob('fadein', 'low', {color: [0, 255,0], delay: 05});
        RGBControl.newJob('fadeout', 'low', {color: [0, 255,0], delay: 05});
        RGBControl.newJob('fadein', 'low', {color: [0, 0,255], delay: 05});
        RGBControl.newJob('fadeout', 'low', {color: [0, 0,255], delay: 05});
        RGBControl.newJob('fadein', 'low', {color: [255, 0,255], delay: 05});
        RGBControl.newJob('fadeout', 'low', {color: [255,0,255], delay: 05});
        res.json({ data: [{ set: true }], errors: []});
    });

    router.ws('/color', function(ws, req) {
        ws.on('message', function(msg) {
            ws.send(msg);
        });
    });

    app.use('/install', router);
};
