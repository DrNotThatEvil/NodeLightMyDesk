const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
let RGBControl = require('../../lib/RGBControl');


module.exports = (app) => {
    RGBControl = new RGBControl(app);
    require('../../lib/RGBFadeIn')(RGBControl);
    require('../../lib/RGBFadeOut')(RGBControl);

    router.get('/getcolor', (req, res) => {
        let color = RGBControl.getColor();
        res.json({ data: [{ set: true, value: color }], errors: []});
    });

    router.get('/getstatus', (req, res) => {
        let status = RGBControl.getStatus();
        res.json({ data: [{ set: true, value: status }], errors: []});
    });

    app.use('/dashboard', router);
};
