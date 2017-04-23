const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const public_app = express();
const path = require('path');
const fs = require('fs');
const router = express.Router();

global.appRoot = path.resolve(__dirname);

var configDir = path.join(global.appRoot, 'config');
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir);
}

var stateDir = path.join(global.appRoot, 'state');
if (!fs.existsSync(stateDir)) {
  fs.mkdirSync(stateDir);
}

let RGBControl = require('./lib/RGBControl');
const rgbControl = new RGBControl(app, public_app);

require('./lib/RGBFadeIn')(rgbControl);
require('./lib/RGBFadeOut')(rgbControl);
require('./lib/RGBSteadyColor')(rgbControl);
require('./lib/RGBRave')(rgbControl);
require('./lib/RGBArraySteadyColor')(rgbControl);

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

// Setting up the process ending system.
process.stdin.resume();//so the program will not close instantly

var exitCount = 0;
function exitHandler(options, err)
{
  if(exitCount == 0) 
  {
    exitCount = exitCount + 1;
    rgbControl.saveState();
    pluginSystem.saveState();
  }
  
  //if (options.cleanup)
  //{
    //console.log('clean');
  //}

  if (err)
  {
    console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
    console.log(err.stack);
  }

  if (options.exit)
  {
    process.exit(); 
  }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, {cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
////

server.on('error', function(err) {
  console.log('LightMyDesk server had a error:');
  console.log(err)
});

public_server.on('error', function(err) {
  console.log('LightMyDesk Public server had a error:');
  console.log(err)
});

server.listen(3000, () => {
  console.log('LightMyDesk is admin is listening on port 3000!');
});

public_server.listen(3080, () => {
  console.log('The public interface for LightMyDesk is listening on port 3080!');
});
