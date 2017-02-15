/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:8080/build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {/* REACT HOT LOADER */ if (false) { (function () { var ReactHotAPI = require("/home/wilvin/development/NodeLightMyDesk/node_modules/react-hot-api/modules/index.js"), RootInstanceProvider = require("/home/wilvin/development/NodeLightMyDesk/node_modules/react-hot-loader/RootInstanceProvider.js"), ReactMount = require("react-dom/lib/ReactMount"), React = require("react"); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

	'use strict';

	//var webpack = require('webpack');

	module.exports = {
	  entry: {
	    app: ['webpack/hot/dev-server', 'whatwg-fetch', __dirname + '/js/entry.js']
	  },
	  output: {
	    filename: 'bundle.js',
	    path: __dirname + '/static/build',
	    publicPath: 'http://localhost:8080/build/'
	  },
	  devServer: {
	    contentBase: __dirname + '/public',
	    publicPath: 'http://localhost:8080/build/',
	    inline: true,
	    historyApiFallback: true,
	    hot: true
	  },
	  module: {
	    loaders: [{
	      test: /\.js$/,
	      exclude: /(node_modules|bower_components)/,
	      loaders: ['react-hot', 'babel?presets[]=es2015,presets[]=stage-0,presets[]=react']
	    }, {
	      test: /\.css$/,
	      loaders: ['style', 'css']
	    }, {
	      test: /.(ico|png|jpg|gif|svg|eot|ttf|woff|woff2)(\?.+)?$/,
	      loader: 'url?limit=150000'
	    }, {
	      test: /\.mp4$/,
	      loader: 'url?limit=100000&mimetype=video/mp4'
	    }]
	  },
	  //  plugins: [
	  //    new webpack.HotModuleReplacementPlugin()
	  //  ],
	  resolve: {
	    extensions: ['', '.js', '.json', '.scss']
	  }
	};

	/* REACT HOT LOADER */ }).call(this); } finally { if (false) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = require("/home/wilvin/development/NodeLightMyDesk/node_modules/react-hot-loader/makeExportsHot.js"); if (makeExportsHot(module, require("react"))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "webpack.config.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }
/******/ ]);