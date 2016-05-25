"use strict";

var PriorityQueue = require('bull/lib/priority-queue');

class RGBControl
{
    constructor(config)
    {
        this.state = {
            chipType: '',
            deviceName: '',
            numLeds: 1
        };

        this.queue = PriorityQueue("RGBJobs");

        this.processors = [];

        this.queue.process((job, done) => {
            console.log("Processing job: " + job.data.type);
            this.processJob(job.data.type, "FLURBO");
            done(null, true);
        });

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
}

module.exports = (new RGBControl());
