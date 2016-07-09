'use strict';

const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');
const irc = require('irc');
var Client = require("irc-client");
const Color = require('color');

let app;

const RGBControl = global.rgbcontrol;

let status = false;
let ircConnected = false;
let ircClient;
let lastChange = 0;
let waitTimeSec = 3;

let lastDonationId = '';
let donationLoop;
let ravePerEuro = 25; // we want 25 seconds of rave per euro cause we dont want it to be on to long

let validCommands = ['!setcolor', '!commands', '!info', '!socials'];
let onlineCommands = ['!setcolor'];
let usage = {
    '!setcolor': 'Set the color of the ledstrip around my desk. Useage: !setcolor <color>',
    '!commands': 'The current command. Shows all commands and how to use them',
    '!info': 'Gives a bit of info about me. SpaceSpunge..',
    '!socials': 'Displays my socials.'
};

let config = {
    twitchServer: '',
    twitchPort: '',
    twitchOauth: '',
    twitchChannel: '',
    twitchNick: '',
    twitchAlertsToken: ''
};

function canConnect()
{
    if(!('twitchServer' in config))
    {
        return false;
    }

    if(config.twitchServer.trim() == '')
    {
        return false;
    }

    if(!('twitchPort' in config))
    {
        return false;
    }

    if(config.twitchPort.trim() == '')
    {
        return false;
    }

    if(!('twitchOauth' in config))
    {
        return false;
    }

    if(config.twitchOauth.trim() == '')
    {
        return false;
    }

    if(!('twitchChannel' in config))
    {
        return false;
    }

    if(config.twitchChannel.trim() == '')
    {
        return false;
    }

    if(!('twitchNick' in config))
    {
        return false;
    }

    if(config.twitchNick.trim() == '')
    {
        return false;
    }

    return true;
}

function canConnectToTwitchAlert()
{
    if(!('twitchAlertsToken' in config))
    {
        return false;
    }

    if(config.twitchAlertsToken.trim() == '')
    {
        return false;
    }

    return true;
}

function fetchLastDonation(cb)
{
    if(!canConnectToTwitchAlert())
        return cb(lastDonationId, {});

    https.get({
        host: 'www.twitchalerts.com',
        path: '/api/v1.0/donations?access_token=' + config.twitchAlertsToken.trim() + '&limit=1'
    }, (response) => {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            // Data reception is done, do whatever with it!
            try
            {
                var parsed = JSON.parse(body);
                if(parsed.data.length > 0)
                    cb(parsed.data[0].donation_id, parsed.data[0]);
                else
                    cb(lastDonationId, {});
            }
            catch(e)
            {
                console.log(e);
                cb(lastDonationId, {});
            }

        });
    }).on('error', (e) => {
        console.log("Got an error connecting to twitch alerts:", e);
    });
}

function donationCheckLoop()
{
    if(!canConnectToTwitchAlert())
        return;

    if(!status)
        return;

    fetchLastDonation((id, data) => {
        if(id != lastDonationId)
        {
            lastDonationId = id;

            if(status)
            {
                let curColor = RGBControl.getColor();
                let durationCalc = (Math.ceil(data.amount*20)/20).toFixed(2) * ravePerEuro;
                durationCalc *= 1000;
                RGBControl.newJob('rave', {duration: durationCalc});
                RGBControl.newJob('steadycolor', {color: [curColor[0], curColor[1], curColor[2]], translate: true}, {repeat: true});
            }
        }
    });
}

function handleCommands(from, message)
{
    if(!ircConnected && (ircClient == null))
        return;

    let args = message.split(' ');

    if(validCommands.indexOf(args[0]) != -1)
    {
        if(!status && onlineCommands.indexOf(args[0]) != -1)
        {
            ircClient.say('#'+config.twitchChannel, 'Im offline! That command wil not work right now. Sorry :C');
            return;
        }

        if(args[0] == '!setcolor')
        {
            let now = Math.floor(new Date() / 1000);

            if(now > (lastChange + waitTimeSec))
            {

                if(args.length == 2)
                {
                    lastChange = now;
                    try
                    {
                        let c = Color(args[1]);

                        let curColor = RGBControl.getColor();
                        RGBControl.newJob('fadeout', {color: [curColor[0], curColor[1], curColor[2]], delay: 5, translate: true});
                        RGBControl.newJob('fadein', {color: [c.red(), c.green(), c.blue()], delay: 5, translate: true});
                        RGBControl.newJob('steadycolor', {color: [c.red(), c.green(), c.blue()], translate: true}, {repeat: true});
                    }
                    catch (e)
                    {
                        ircClient.say('#'+config.twitchChannel, 'Thats a invalid color! (use a word or a hex value like #FF00FF)');
                    }
                }
                else
                {
                    ircClient.say('#'+config.twitchChannel, 'You forgot to send a color!' );
                }
            }
            else
            {
                let dif = Math.floor((lastChange + waitTimeSec) - now);
                ircClient.say('#'+config.twitchChannel, 'The color was recently changed. Please wait ' + dif + ' seconds' );
            }
        }

        if(args[0] == '!commands')
        {
            ircClient.say('#'+config.twitchChannel, 'Commands and there ussage: ');
            for (var command in usage)
            {
                if (!usage.hasOwnProperty(command)) continue;

                let usagemsg = usage[command];
                ircClient.say('#'+config.twitchChannel, command + ': ' + usagemsg);
            }
        }

        if(args[0] == '!socials')
        {
            ircClient.say('#'+config.twitchChannel, 'I currently have a twitter at: https://twitter.com/SpaceSpunge. More socials comming soon!');
        }

        if(args[0] == '!info')
        {
            // yes i know this bit is really un nessecary but i dont want to change my age all the time.
            // And why the fuck not add it in a calculation ? seems more logical to me...

            let today = new Date();
            let birthDate = new Date(1994, 7, 24);
            let age = today.getFullYear() - birthDate.getFullYear();
            let m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
            {
                age--;
            }

            ircClient.say('#'+config.twitchChannel, 'Some info about me: Hi im spacespunge! Im a '+age+' year old programmer from the netherlands. I like to stream from now and then with friends! Come and join me and lets have fun together!');

            // see i told you it was more logical to add a age calculation!
            // now i can do cool stuf with it. like tell everybody!
            if(today.getDate() == birthDate.getDate())
            {
                ircClient.say('#'+config.twitchChannel, 'By the way: !!! ITS MY BIRTHDAY !!! YAY ME !');
            }
        }

    }
    else
    {
        ircClient.say('#'+config.twitchChannel, 'Sorry thats not a valid command!');
        ircClient.say('#'+config.twitchChannel, 'Use !commands to view all commands');
    }
}

function connectIrc()
{
    if(ircConnected && (ircClient != null))
    {
        ircClient.disconnect('My config has changed. Need to restart!');
        ircConnected = false;
    }

    if(!canConnect())
        return;

    ircClient = new irc.Client(config.twitchServer, config.twitchNick, {
        floodProtection: false,
        debug: false,
        autoRejoin: true,
        autoConnect: true,
        userName: config.twitchNick,
        password: 'oauth:'+config.twitchOauth,
        secure: false,
        port: config.twitchPort,
        channels: ['#'+config.twitchChannel],
	millisecondsBeforePingTimeout: 15 * 1000,
	millisecondsOfSilenceBeforePingSent: 45 * 1000
    });

    //ircClient.connect();
    ircClient.addListener('error', function (message) {
        console.log('error: ', message);
    });

    ircClient.addListener('message#'+config.twitchChannel , function (from, message) {
        if(!ircConnected)
            ircConnected = true;

        if(message.charAt(0) == '!')
            handleCommands(from, message);
    });
}

function loadData()
{
    let configFile = path.join(__dirname, 'twitch', 'config', 'twitchconfig.json');
    if(fs.existsSync(configFile))
    {
        config = require(configFile);
    }
}

function setData(setconfig)
{
    config = setconfig;

    let configFile = path.join(__dirname, 'twitch', 'config', 'twitchconfig.json');
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

    connectIrc();
    lastDonationId = fetchLastDonation();
}

function addRoutes(router)
{
    router.use('/twitchstatic', express.static(path.join(__dirname, 'twitch', 'static')));

    router.get('/gettwitchdata', (req, res) => {
        res.json({ data: [config], errors: []});
    });

    router.post('/settwitchdata', (req, res) => {
        if(!('config' in req.body))
        {
            res.json({ data: [], errors: [{
                error: 'MissingParameter',
                errorStr: 'Missing config paramater'
            }]});
            return;
        }

        if(!('twitchServer' in req.body.config))
        {
            res.json({ data: [], errors: [{
                error: 'MissingConfigParameter',
                errorStr: 'Missing twitchServer in config'
            }]});
            return;
        }

        if(!('twitchPort' in req.body.config))
        {
            res.json({ data: [], errors: [{
                error: 'MissingConfigParameter',
                errorStr: 'Missing twitchPort in config'
            }]});
            return;
        }

        if(!('twitchOauth' in req.body.config))
        {
            res.json({ data: [], errors: [{
                error: 'MissingConfigParameter',
                errorStr: 'Missing twitchOauth in config'
            }]});
            return;
        }

        if(!('twitchChannel' in req.body.config))
        {
            res.json({ data: [], errors: [{
                error: 'MissingConfigParameter',
                errorStr: 'Missing twitchChannel in config'
            }]});
            return;
        }

        if(!('twitchNick' in req.body.config))
        {
            res.json({ data: [], errors: [{
                error: 'MissingConfigParameter',
                errorStr: 'Missing twitchNick in config'
            }]});
            return;
        }

        if(!('twitchAlertsToken' in req.body.config))
        {
            res.json({ data: [], errors: [{
                error: 'MissingConfigParameter',
                errorStr: 'Missing twitchAlertsToken in config'
            }]});
            return;
        }

        setData(req.body.config);
        res.json({ data: [{ set: true, value: config }], errors: []});
    });
}

function setStatus(val)
{
    status = val;
}

function getStatus()
{
    return status;
}

function getSidebarData()
{
    return {
        id: 'twitch',
        name: 'Twitch Plugin',
        url: '/plugin/twitch/twitchstatic/',
	apiurl: '/plugin/twitch/',
        status: status
    };
}

function initPlugin()
{
    loadData();
    connectIrc();
    fetchLastDonation((id, data) => {
        lastDonationId = id;
        //console.log(lastDonationId);
    });


    donationLoop = setInterval(donationCheckLoop, 500);
}

module.exports = function(module_holder, appval) {
    app = appval;
    // the key in this dictionary can be whatever you want
    // just make sure it won't override other modules
    module_holder['twitch'] = {
        addRoutes: addRoutes,
        setStatus: setStatus,
        getStatus: getStatus,
        getSidebarData: getSidebarData,
        initPlugin: initPlugin
    };
};
