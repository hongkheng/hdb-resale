var path = require('path');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'react-hot!babel'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader!postcss-loader'
    }]
  },
  postcss: function () {
    return [autoprefixer];
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
