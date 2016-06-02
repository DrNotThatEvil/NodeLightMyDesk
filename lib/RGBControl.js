'use strict';
const fs = require('fs');
const path = require('path');
const expressWs = require('express-ws');
const PriorityQueue = require('bull/lib/priority-queue');
const SPI = require('pi-spi');

class RGBControl
{
    constructor(app)
    {
        this.state = {
            chipType: '',
            deviceName: '',
            colorMap: { r: 'r', g: 'g', b: 'b' },
            numLeds: 1,
            curColor: [0,0,0],
            status: true
        };

        this.queue = PriorityQueue('RGBJobs');
        this.device = {};
        this.processors = [];
        this.gamma = Buffer(256);

        this.queue.process((job, done) => {
            this.processJob(job.data.type, job.data, done, job);
        });

        if(app)
        {
            this.ws = expressWs(app);

            this.queue.on('progress', (job, progress) => {
                if(progress == 1)
                {
                    this.ws.getWss('/install/color').clients.forEach(function (client) {
                        if('curColor' in job.data)
                        {
                            client.send(JSON.stringify(job.data));
                        }
                    });
                }
            });

            this.queue.on('completed', (job) => {
                this.ws.getWss('/install/color').clients.forEach(function (client) {
                    client.send(JSON.stringify({
                        jobType: job.data.type,
                        status: 'DONE'
                    }));
                });
            });
        }
    }

    processJob(name, data, done, job)
    {
        if('undefined' != typeof(this.processors[name]))
            for(let i = 0; i < this.processors[name].length; ++i )
                if(true != this.processors[name][i](this, data, done, job) ) { break; }
    }

    registerProcessor(name, callback)
    {
        if('undefined' == typeof(this.processors[name]))
            this.processors[name] = [];
        this.processors[name].push(callback);
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
        try{
            fs.writeFileSync(config, JSON.stringify({
                chipType: this.state.chipType,
                deviceName: this.state.deviceName,
                colorMap: this.state.colorMap,
                numLeds: this.state.numLeds
            }, null, 4), {}, (err) => {
                if(err)
                    console.log(err);
            });

            return true;
        }
        catch(e)
        {
            return false;
        }
    }

    newJob(type, priority, ops)
    {
        this.queue.add(Object.assign({}, { type: type }, (ops || {})), { priority: (priority || 'normal') });
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
