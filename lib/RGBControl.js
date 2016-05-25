'use strict';

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

        this.queue = PriorityQueue('RGBJobs');

        this.processors = [];

        this.queue.process((job, done) => {
            console.log('Processing job: ' + job.data.type);
            this.processJob(job.data.type, 'FLURBO');
            done(null, true);
        });

        let led = [];
        for(let i=0; i<50; i++)
        {
            led.push(255, 0, 0);
        }

        this.writeStream(led);
    }

    processJob(name)
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

    getChipType()
    {
        return this.state.chipType;
    }

    setDeviceName(deviceName)
    {
        this.state.deviceName = deviceName;
    }

    getDeviceName()
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
            if(this.state.chipType == 'LPD6803')
            {

                let pixelSize = 3;
                let pixelOutBites = Buffer(2);
                let spi = SPI.initialize('/dev/spidev0.1');

                let startFrame = Buffer('\x00\x00\x00\x00', 'binary');
                spi.transfer(startFrame, startFrame.length, (e,d) => {

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

                    //console.log(pixelOutBites);
                    spi.transfer(pixelOutBites, pixelOutBites.length, (e,d) => {

                    });
                }
            }
        }
    }
}

module.exports = (new RGBControl());
