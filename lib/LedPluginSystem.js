'use strict';

const fs = require('fs');
const path_modle = require('path');
const express = require('express');
const router = express.Router();
const public_router = express.Router();

class LedPluginSystem
{
  constructor()
  {
    this.module_holder = {};
  }

  initPlugins(app, public_app)
  {
    let plugins = path_modle.join(global.appRoot, 'plugins');
    this.loadModules(plugins, app);
    this.setupRoutes(app);
    this.setupPublicRoutes(public_app);
    this.setupSidebar(app);

    for (let plugin in this.module_holder)
    {
      if (!this.module_holder.hasOwnProperty(plugin)) { continue; }

      let module = this.module_holder[plugin];
      if('initPlugin' in module)
      {
        module.initPlugin();
      }
    }
  }

  loadModules(path, app)
  {
    let dir = fs.readdirSync(path);
    dir.forEach((file) => {
      let filename = path_modle.join(path, file);
      let stat = fs.statSync(filename);
      if (stat.isDirectory())
      {
        // we have a directory: do a tree walk
        // fs.readdir(filename, (err, files) => {
        //     var f, l = files.length;
        //     for (var i = 0; i < l; i++) {
        //         f = path_modle.join(filename, files[i]);
        //         this.loadModules(f);
        //     }
        // });
      }
      else
      {
        let ext = filename.split('.').pop();
        if(ext == 'js')
          require(filename.replace(/\.[^/.]+$/, ''))(this.module_holder, app);
      }
    });
  }

  setupRoutes(app)
  {
    for (let plugin in this.module_holder)
    {
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

  setupPublicRoutes(app)
  {
    for (let plugin in this.module_holder)
    {
      if (!this.module_holder.hasOwnProperty(plugin)) { continue; }

      let module = this.module_holder[plugin];
      if('addPublicRoutes' in module)
      {
        module.addPublicRoutes(public_router);
        app.use('/plugin/'+plugin, public_router);
      }
    }

    //app.use('/plugin', router);
  }

  setupSidebar(app)
  {
    router.get('/sidebar', (req, res) => {
      let allPlugins = [];

      for (let plugin in this.module_holder)
      {
        if (!this.module_holder.hasOwnProperty(plugin)) { continue; }

        let module = this.module_holder[plugin];
        if('getSidebarData' in module)
        {
          allPlugins.push(module.getSidebarData());
        }
      }

      res.json({ data: allPlugins, errors: []});
    });

    router.post('/setpluginstatus', (req, res) => {
      if(!('id' in req.body))
      {
        res.json({ data: [], errors: [{
          error: 'MissingParameter',
          errorStr: 'Missing id paramater'
        }]});
        return;
      }

      if(!('value' in req.body))
      {
        res.json({ data: [], errors: [{
          error: 'MissingParameter',
          errorStr: 'Missing value paramater'
        }]});
        return;
      }

      let module = this.module_holder[req.body.id];
      if(typeof module === 'undefined')
      {
        res.json({ data: [], errors: [{
          error: 'ModuleNotFound',
          errorStr: 'No module was found with that id'
        }]});
        return;
      }

      module.setStatus(req.body.value);

      res.json({ data: [{ set: true, value: module.getStatus() }], errors: []});
    });

    app.use('/plugin', router);
  }
}

module.exports = (new LedPluginSystem());
