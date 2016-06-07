'use strict';

const fs = require('fs');
const path_modle = require('path');
const express = require('express');
const router = express.Router();

class LedPluginSystem
{
    constructor()
    {
        this.module_holder = {};
    }

    initPlugins(app)
    {
        let plugins = path_modle.join(global.appRoot, 'plugins');
        this.loadModules(plugins);
        this.setupRoutes(app);
    }

    loadModules(path)
    {
        let dir = fs.readdirSync(path);
        dir.forEach((file) => {
            let filename = path_modle.join(path, file);
            let stat = fs.statSync(filename);
            if (stat.isDirectory())
            {
                // we have a directory: do a tree walk
                fs.readdir(filename, (err, files) => {
                    var f, l = files.length;
                    for (var i = 0; i < l; i++) {
                        f = path_modle.join(filename, files[i]);
                        this.loadModules(f);
                    }
                });
            }
            else
            {
                let ext = filename.split('.').pop();
                if(ext == 'js')
                    require(filename.replace(/\.[^/.]+$/, ''))(this.module_holder);
            }
        });
    }

    setupRoutes(app)
    {
        for (let plugin in this.module_holder) {
            if (!this.module_holder.hasOwnProperty(plugin)) { continue; }

            let module = this.module_holder[plugin];
            if('addRoutes' in module)
            {
                module.addRoutes(router);
                app.use('/plugin/'+plugin, router);
            }
        }

        //app.use('/plugin', router);
    }
}

module.exports = (new LedPluginSystem());
