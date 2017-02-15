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
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['react-hot', 'babel?presets[]=es2015,presets[]=stage-0,presets[]=react']
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /.(ico|png|jpg|gif|svg|eot|ttf|woff|woff2)(\?.+)?$/,
        loader: 'url?limit=150000'
      },
      {
        test: /\.mp4$/,
        loader: 'url?limit=100000&mimetype=video/mp4'
      }
    ]
  },
//  plugins: [
//    new webpack.HotModuleReplacementPlugin()
//  ],
  resolve: {
    extensions: ['', '.js', '.json', '.scss']
  }
};
