const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const RGBControl = require("../../lib/RGBControl");

module.exports = (app) => {
    router.get('/checkinstall', (req, res) => {
        res.json({ installed: fs.existsSync(path.join(global.appRoot, 'config', 'rgbconfig.json')) });
    });

    router.get('/setchiptype/:chiptype', (req, res) => {
        RGBControl.setChipType(req.params.chiptype);
        res.json({ set: true });
    });

    router.get('/setdevicename/:devicename', (req, res) => {
        RGBControl.setDeviceName(req.params.devicename);
        res.json({ set: true });
    });

    app.use('/install', router);
}
