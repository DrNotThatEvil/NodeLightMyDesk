const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const public_app = express();

const router = express.Router();
const path = require('path');

global.appRoot = path.resolve(__dirname);

let RGBControl = require('./lib/RGBControl');
const rgbControl = new RGBControl(app, public_app);

require('./lib/RGBFadeIn')(rgbControl);
require('./lib/RGBFadeOut')(rgbControl);
require('./lib/RGBSteadyColor')(rgbControl);
require('./lib/RGBRave')(rgbControl);

global.rgbcontrol = rgbControl;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.use(express.static(__dirname + '/public'));

const pluginSystem = require('./lib/LedPluginSystem');
pluginSystem.initPlugins(app, public_app);

require('./app/controllers/Install')(app);
require('./app/controllers/Dashboard')(app);

app.use('/', router);

var server = require('http').createServer(app);
var public_server = require('http').createServer(public_app);

server.listen(3000, () => {
    console.log('LightMyDesk is admin is listening on port 3000!');
});

public_server.listen(3080, () => {
    console.log('The public interface for LightMyDesk is listening on port 3080!');
});
