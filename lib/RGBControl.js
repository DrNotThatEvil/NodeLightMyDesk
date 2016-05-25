"use strict";

const PriorityQueue = require('bull/lib/priority-queue');
const SPI = require('pi-spi');

class RGBControl
{
    constructor(config)
    {
        this.state = {
            chipType: 'LPD6803',
            deviceName: '/dev/spidev0.1',
            deviceReady: true,
            numLeds: 1
        };

        this.queue = PriorityQueue("RGBJobs");

        this.processors = [];

        this.queue.process((job, done) => {
            console.log("Processing job: " + job.data.type);
            this.processJob(job.data.type, "FLURBO");
            done(null, true);
        });

        this.writeStream([255, 0, 0, 0, 255, 0, 0, 0, 255]);
    }

    processJob(name, data)
    {
        if('undefined' != typeof(this.processors[name]))
            for(let i = 0; i < this.processors[name].length; ++i )
                if(true != this.processors[name][i](this, arguments ) ) { break; }
    }

    registerProcessor(name, callback)
    {
        if( 'undefined' == typeof(this.processors[name]))
            this.processors[name] = [];
        this.processors[name].push(callback);
    }

    setChipType(chipType)
    {
        this.state.chipType = chipType;
    }

    getChipType(chipType)
    {
        return this.state.chipType;
    }

    setDeviceName(deviceName)
    {
        this.state.deviceName = deviceName;
    }

    getDeviceName(deviceName)
    {
        return this.state.deviceName;
    }

    newJob(type, priority, ops)
    {
        this.queue.add(Object.assign({}, { type: type }, (ops || {})), { priority: (priority || 'normal') });
    }

    writeStream(pixels)
    {
        if(this.state.deviceReady)
        {
            if(this.state.chipType == "LPD6803")
            {
                let pixel_size = 3
                let pixelOutBites = Buffer(2);
                let spi = SPI.initialize("/dev/spidev0.1");

                let startFrame = Buffer('\x00\x00\x00\x00', 'binary');
                spi.transfer(startFrame, startFrame.length, (e,d) => {

                });

                for(let i = 0; i < (pixels.length/pixel_size); i++)
                {
                    let pixel_offset = (i * pixel_size)
                    let pixel_in = pixels.slice(i, pixel_size)

                    console.log(pixel_in)
                }

            }
        }
    }
}

module.exports = (new RGBControl());
