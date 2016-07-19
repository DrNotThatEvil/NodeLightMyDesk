'use strict';

const Beam = require('beam-client-node');
const BeamInteractive = require('beam-interactive-node');
const io = require('socket.io-client');

const fs = require('fs');
const express = require('express');
const path = require('path');

let app;

const RGBControl = global.rgbcontrol;

let status = false;
let lastChangeTime = 0;

let ravePerEuro = 15; // we want 15 seconds of rave per euro cause we dont want it to be on to long

let config = {
    streamId: '',
    username: '',
    password: '',
    facode: '',
    streamJarApi: ''
};

function canConnect()
{
    if(!('streamId' in config))
    {
        return false;
    }

    if(config.streamId.trim() == '')
    {
        return false;
    }

    if(!('username' in config))
    {
        return false;
    }

    if(config.username.trim() == '')
    {
        return false;
    }

    if(!('password' in config))
    {
        return false;
    }

    if(config.password.trim() == '')
    {
        return false;
    }

    return true;
}

function canConnectToStreamJar()
{
    if(!('streamJarApi' in config))
    {
        return false;
    }

    if(config.streamJarApi.trim() == '')
    {
        return false;
    }

    return true;
}

function connectToStreamJar()
{
    if(!canConnectToStreamJar())
        return;

    var sock = io('https://ws.streamjar.tv/', { query: 'key='+config.streamJarApi });
    sock.on('connect', function() {
        console.log('Connected to streamjar');
    });

    sock.on('connect_error', function(error) {
        console.log(error);
    });

    sock.on('donation', function(donation) {
        console.log(donation.name + ' just donated to the stream.');

        var curColor = RGBControl.getColor();
        var unix = Math.floor(Date.now() / 1000);

        //console.log(unix, lastChangeTime, color);
        if(status)
        {
            if((lastChangeTime + 20) < unix)
            {
                lastChangeTime = unix;
                let curColor = RGBControl.getColor();
                let durationCalc = (Math.ceil(donation.amount*20)/20).toFixed(2) * ravePerEuro;
                durationCalc *= 1000;
                RGBControl.newJob('rave', {duration: durationCalc});
                RGBControl.newJob('steadycolor', {color: [curColor[0], curColor[1], curColor[2]], translate: true}, {repeat: true});
            }
        }
    });
}

function changeColor(color)
{
    var curColor = RGBControl.getColor();
    var unix = Math.floor(Date.now() / 1000);

    //console.log(unix, lastChangeTime, color);

    if(curColor.join(',') !== color.join(','))
    {
        if((lastChangeTime + 2) < unix)
        {
            lastChangeTime = unix;
            RGBControl.newJob('fadeout', {color: [curColor[0], curColor[1], curColor[2]], delay: 5, translate: true});
            RGBControl.newJob('fadein', {color: color, delay: 5, translate: true});
            RGBControl.newJob('steadycolor', {color: color, translate: true}, {repeat: true});
        }
    }
}

let btn0Down = false;
let btn1Down = false;
let btn2Down = false;
let btn3Down = false;
let btn4Down = false;
let btn5Down = false;
let btn6Down = false;
let btn7Down = false;


function connectBeam()
{
    if(!canConnect())
        return;

    var beam = new Beam();

    beam.use('password', {
        username: config.username,
        password: config.password,
        code: config.facode
    }).attempt().then(function () {
        console.log('Connected to beam!');
        return beam.game.join(parseInt(config.streamId));
    }).then(function (res) {
        var details = {
            remote: res.body.address,
            channel: parseInt(config.streamId),
            key: res.body.key
        };

        var robot = new BeamInteractive.Robot(details);
        robot.handshake(function (err) {
            if (err) throw new Error('Error connecting to Ledstrip thingy', err);
        });

        robot.on('report', function (report) {
            let buttons = report.tactile;

            if(buttons.length > 1)
            {
                // 0 red
                // 1 green
                // 2 blue
                // 3 yellow
                // 4 pink
                // 5 orange

                // 6 RAVE

                // 7 Cyan

                buttons.forEach((button) => {
                    switch (button.id)
                    {
                    case 0:
                        if(button.holding > 0)
                        {
                            btn0Down = true;
                        }
                        if(btn0Down == true && button.holding == 0)
                        {
                            changeColor([255, 0, 0]);
                            btn0Down = false;
                        }
                        break;
                    case 1:
                        if(button.holding > 0)
                        {
                            btn1Down = true;
                        }
                        if(btn1Down == true && button.holding == 0)
                        {
                            changeColor([0, 255, 0]);
                            btn1Down = false;
                        }
                        break;
                    case 2:
                        if(button.holding > 0)
                        {
                            btn2Down = true;
                        }
                        if(btn2Down == true && button.holding == 0)
                        {
                            changeColor([0, 0, 255]);
                            btn2Down = false;
                        }
                        break;
                    case 3:
                        if(button.holding > 0)
                        {
                            btn3Down = true;
                        }
                        if(btn3Down == true && button.holding == 0)
                        {
                            changeColor([255, 255, 0]);
                            btn3Down = false;
                        }
                        break;
                    case 4:
                        if(button.holding > 0)
                        {
                            btn4Down = true;
                        }
                        if(btn4Down == true && button.holding == 0)
                        {
                            changeColor([255, 0, 255]);
                            btn4Down = false;
                        }
                        break;
                    case 5:
                        if(button.holding > 0)
                        {
                            btn5Down = true;
                        }
                        if(btn5Down == true && button.holding == 0)
                        {
                            changeColor([255, 165, 0]);
                            btn5Down = false;
                        }
                        break;
                    case 6:
                        // if(button.holding > 0)
                        // {
                        //     btn6Down = true;
                        // }
                        // if(btn6Down == true && button.holding == 0)
                        // {
                        //     btn6Down = false;
                        //     //RAVE
                        //     var curColor = RGBControl.getColor();
                        //     var unix = Math.floor(Date.now() / 1000);
                        //
                        //     //console.log(unix, lastChangeTime, color);
                        //
                        //     if((lastChangeTime + 20) < unix)
                        //     {
                        //         lastChangeTime = unix;
                        //         let curColor = RGBControl.getColor();
                        //         let durationCalc = 10 * 1000;
                        //         RGBControl.newJob('rave', {duration: durationCalc});
                        //         RGBControl.newJob('steadycolor', {color: [curColor[0], curColor[1], curColor[2]], translate: true}, {repeat: true});
                        //     }
                        // }
                        break;
                    case 7:
                        if(button.holding > 0)
                        {
                            btn7Down = true;
                        }
                        if(btn7Down == true && button.holding == 0)
                        {
                            changeColor([0, 255, 255]);
                            btn7Down = false;
                        }
                        break;
                    default:
                        break;
                    }
                });
            }
        });
    }).catch(function(reason){
        console.log('Beam error woups');
    });
}

function loadData()
{
    let configFile = path.join(__dirname, 'beampro', 'config', 'beamconfig.json');
    if(fs.existsSync(configFile))
    {
        config = require(configFile);
    }
}

function setData(setconfig)
{
    config = setconfig;

    let configFile = path.join(__dirname, 'beampro', 'config', 'beamconfig.json');
    try
    {
        fs.writeFileSync(configFile, JSON.stringify(config, null, 4), {}, (err) => {
            if(err)
                console.log(err);
        });
    }
    catch(e)
    {
        return false;
    }

    connectBeam();
    connectToStreamJar();
    //lastDonationId = fetchLastDonation();
}

function addRoutes(router)
{
    router.use('/beamprostatic', express.static(path.join(__dirname, 'beampro', 'static')));

    router.get('/getbeamdata', (req, res) => {
        res.json({ data: [config], errors: []});
    });

    router.post('/setbeamdata', (req, res) => {
        setData(req.body.config);
        res.json({ data: [{ set: true, value: config }], errors: []});
    });
}

function setStatus(val)
{
    status = val;

    if(status)
    {
        connectBeam();
        canConnectToStreamJar();
    }
}

function getStatus()
{
    return status;
}

function getSidebarData()
{
    return {
        id: 'beampro',
        name: 'Beam.pro Plugin',
        url: '/plugin/beampro/beamprostatic/',
        apiurl: '/plugin/beampro/',
        status: status
    };
}

function initPlugin()
{
    loadData();
    //connectBeam();
    connectToStreamJar();
}

module.exports = function(module_holder, appval) {
    app = appval;
    // the key in this dictionary can be whatever you want
    // just make sure it won't override other modules
    module_holder['beampro'] = {
        addRoutes: addRoutes,
        setStatus: setStatus,
        getStatus: getStatus,
        getSidebarData: getSidebarData,
        initPlugin: initPlugin
    };
};
