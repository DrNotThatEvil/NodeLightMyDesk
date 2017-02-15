'use strict';
const fs = require('fs');
const path = require('path');
const SPI = require('pi-spi');

const WebSocketServer = require('ws').Server
 , wss = new WebSocketServer({ port: 8880 });

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    try
    {
      client.send(data);
    } catch(e) {
      //console.log('Could not send websocket data to some clients');
    }
  });
};


let instance = null;

class RGBControl
{
  constructor()
  {
    if (!instance) {
      instance = this;
    }

    this.state = {
      chipType: '',
      deviceName: '',
      colorMap: { r: 'r', g: 'g', b: 'b' },
      numLeds: 1,
      curColor: [0,0,0],
      status: true
    };

    this.jobstate = {
      curJobIndex: 0,
      clearTime: 0,
      jobs: []
    };

    this.device = {};
    this.processors = [];
    this.busy = false;
    this.gamma = Buffer(256);
    this.jobInterval = setInterval(this.jobLoop.bind(this), 25);

    let result = this.loadConfig();
    if(result)
    {
      this.newJob('steadycolor', {color: [0, 0, 0], translate: true}, {repeat: true});
    }

    return instance;
  }

  jobLoop()
  {
    if(this.jobstate.jobs.length > 0)
    {
      if(typeof this.jobstate.jobs[this.jobstate.curJobIndex] !== 'undefined')
      {
        let job = this.jobstate.jobs[this.jobstate.curJobIndex];

        if(!job.started || (job.options.repeat && job.options.finished))
        {
          if(job.started)
          {
            this.jobstate.jobs[this.jobstate.curJobIndex].options.finished = false;
          }

          let unix = Math.floor(new Date() / 1000);
          if(unix > (this.jobstate.clearTime+2))
          {
            this.jobstate.jobs[this.jobstate.curJobIndex].started = true;
            this.processJob(job.type, job.data);
            wss.broadcast(JSON.stringify({
              type: job.type,
              progress: 0,
              data: job.data
            }));
          }
        }
      }
    }
  }

  nextJob()
  {
    if(this.jobstate.jobs.length > 0)
    {
      if(typeof this.jobstate.jobs[this.jobstate.curJobIndex] !== 'undefined')
      {
        var job = this.jobstate.jobs[this.jobstate.curJobIndex];
        wss.broadcast(JSON.stringify({
          type: job.type,
          progress: 100,
          data: job.data
        }));

        if(this.jobstate.jobs.length == 1 && job.options.repeat && !job.options.finished)
        {
          this.jobstate.jobs[this.jobstate.curJobIndex].options.finished = true;
        }
        else
        {
          this.jobstate.jobs.splice(this.jobstate.curJobIndex, 1);
        }
      }
    }
  }

  progressJob(p)
  {
    if(this.jobstate.jobs.length > 0)
    {
      if(typeof this.jobstate.jobs[this.jobstate.curJobIndex] !== 'undefined')
      {
        this.jobstate.jobs[this.jobstate.curJobIndex].progress = p;
        //let job = this.jobstate.jobs[this.jobstate.curJobIndex];
      }
    }
  }

  processJob(name, data)
  {
    if('undefined' != typeof(this.processors[name]))
      for(let i = 0; i < this.processors[name].length; ++i )
        if(true != this.processors[name][i](this, data) ) { break; }
  }

  registerProcessor(name, callback)
  {
    if('undefined' == typeof(this.processors[name]))
      this.processors[name] = [];
    this.processors[name].push(callback);
  }

  translateColor(color)
  {
    let newColor = [0,0,0];

    if(this.state.colorMap.r == 'r')
    {
      newColor[0] = color[0];
    }

    if(this.state.colorMap.r == 'g')
    {
      newColor[1] = color[0];
    }

    if(this.state.colorMap.r == 'b')
    {
      newColor[2] = color[0];
    }

    if(this.state.colorMap.g == 'g')
    {
      newColor[1] = color[1];
    }

    if(this.state.colorMap.g == 'r')
    {
      newColor[0] = color[1];
    }

    if(this.state.colorMap.g == 'b')
    {
      newColor[2] = color[1];
    }

    if(this.state.colorMap.b == 'b')
    {
      newColor[2] = color[2];
    }

    if(this.state.colorMap.b == 'r')
    {
      newColor[0] = color[2];
    }

    if(this.state.colorMap.b == 'g')
    {
      newColor[1] = color[2];
    }

    return newColor;
  }

  getBusy()
  {
    return this.busy;
  }

  getChipType()
  {
    return this.state.chipType;
  }

  getDeviceName()
  {
    return this.state.deviceName;
  }

  getNumLeds()
  {
    return this.state.numLeds;
  }

  setColorMap(map)
  {
    this.state.colorMap = map;
  }

  getColorMap()
  {
    return this.state.colorMap;
  }

  setColor(color)
  {
    this.state.curColor = color;
  }

  getColor()
  {
    return this.state.curColor;
  }

  setStatus(status)
  {
    this.state.status = status;
  }

  getStatus()
  {
    return this.state.status;
  }

  setNumLeds(num)
  {
    this.state.numLeds = (num >= 1 ? num : 1);
  }

  setChipType(chipType)
  {
    this.state.chipType = chipType.toLowerCase();
    if (this.state.chipType == 'lpd6803')
    {
      for(let i=0; i<256; i++)
      {
        this.gamma[i] = Math.floor(Math.pow(i / 255.0, 2.0) * 255.0 + 0.5);
      }
    }
  }

  setDeviceName(deviceName)
  {
    this.state.deviceName = deviceName;
    this.device = SPI.initialize((process.platform === 'win32' ? '\\\\.\\NUL' : deviceName));
  }

  checkDeviceReady()
  {
    return (this.state.chipType != '' && this.state.deviceName != '');
  }

  saveConfig()
  {
    if(!this.checkDeviceReady())
      return false;

    let config = path.join(global.appRoot, 'config', 'rgbconfig.json');
    try
    {
      fs.writeFileSync(config, JSON.stringify({
        chipType: this.state.chipType,
        deviceName: this.state.deviceName,
        colorMap: this.state.colorMap,
        numLeds: this.state.numLeds
      }, null, 4), {}, () => {
        //if(err)
          //console.log(err);
      });

      return true;
    }
    catch(e)
    {
      return false;
    }
  }

  loadConfig()
  {
    let config = path.join(global.appRoot, 'config', 'rgbconfig.json');
    if(fs.existsSync(config))
    {
      let loadConfig = require(config);
      if(!('chipType' in loadConfig))
        return;

      if(loadConfig.chipType == '')
        return;

      if(!('deviceName' in loadConfig))
        return;

      if(loadConfig.deviceName == '')
        return;

      if(!('colorMap' in loadConfig))
        return;

      if(loadConfig.colorMap == '')
        return;

      if(!('numLeds' in loadConfig))
        return;

      if(loadConfig.numLeds == '')
        return;

      this.setChipType(loadConfig.chipType);
      this.setDeviceName(loadConfig.deviceName);
      this.setNumLeds(loadConfig.numLeds);
      this.setColorMap(loadConfig.colorMap);

      return true;
    }
  }

  clearJobs()
  {
    this.jobstate.clearTime = (Math.floor(new Date() / 1000));
    this.jobstate.jobs = [];
  }

  newJob(type, ops, opt)
  {
    //this.queue.add(Object.assign({}, { type: type }, (ops || {})), { priority: (priority || 'normal') });

    let options = Object.assign({}, {
      repeat: false,
      finished: false
    }, (opt || {}));

    let jobObj = Object.assign({},
      {
        started: false,
        progress: 0,
        type: type,
        data: ops,
        options: options
      }
    );

    if(this.state.status == false && jobObj.options.color != [0, 0, 0])
    {
      //console.log('System is not on. Job not added');
      return;
    }

    this.jobstate.jobs.push(jobObj);
    //console.log(this.jobstate.jobs);
  }

  filterPixel(orignal_pixel, brightness)
  {
    let input_pixel = [];
    input_pixel[0] = Math.round((brightness * orignal_pixel[0]));
    input_pixel[1] = Math.round((brightness * orignal_pixel[1]));
    input_pixel[2] = Math.round((brightness * orignal_pixel[2]));
    return input_pixel;
  }

  writeStream(rawPixels, cb)
  {
    let pixelSize = 3;
    let pixels = rawPixels;
    if ((pixels.length / pixelSize) < this.state.numLeds)
    {
      let fill = this.state.numLeds-(pixels.length / pixelSize);
      for(let j=0; j<fill; j++)
      {
        pixels.push(0,0,0);
      }
    }

    if(this.checkDeviceReady())
    {
      if(this.state.chipType == 'lpd6803')
      {
        let pixelOutBites = Buffer(2);

        let startFrame = Buffer('\x00\x00\x00\x00', 'binary');
        this.device.write(startFrame, () => {

        });

        for(let i = 0; i < (pixels.length/pixelSize); i++)
        {
          let pixelOffset = (i * pixelSize);
          let pixelIn = pixels.slice(pixelOffset, pixelOffset+pixelSize);

          let pixelOut = 0b1000000000000000;
          pixelOut |= (pixelIn[0] & 0x00F8) << 7;  // RED is bits 11-15
          pixelOut |= (pixelIn[1] & 0x00F8) << 2;  // GREEN is bits 6-10
          pixelOut |= (pixelIn[2] & 0x00F8) >> 3;  // BLUE is bits 1-5

          pixelOutBites[0] = (pixelOut & 0xFF00) >> 8;
          pixelOutBites[1] = (pixelOut & 0x00FF) >> 0;

          this.device.write(pixelOutBites, () => {

          });
        }

        if(cb)
          cb();
      }
    }
  }
}

module.exports = RGBControl;
