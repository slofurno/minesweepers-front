var path = require('path');
var webpack = require('webpack');

var config = {
  entry: {
    bundle: './src/index'
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: path.join(__dirname, 'src')
    }]
  },
  resolve: {
    root: path.join(__dirname, 'src')
  }
};

if (process.env.NODE_ENV === 'production') {
  config = Object.assign({}, config, {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': '"production"'
        }
      })
    ]
  })
}

module.exports = config
