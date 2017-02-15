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
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

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
	      loaders: ['babel?presets[]=es2015,presets[]=stage-0,presets[]=react']
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
	  //plugins: [
	  //  new webpack.HotModuleReplacementPlugin()
	  //],
	  resolve: {
	    extensions: ['', '.js', '.json', '.scss']
	  }
	};
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }
/******/ ]);