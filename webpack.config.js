const path = require('path');
const webpack = require('webpack');
const { getIfUtils, removeEmpty } = require('webpack-config-utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const { ifDevelopment, ifProduction } = getIfUtils(nodeEnv);

const bundle = [
  path.resolve(__dirname, 'src/lib/mutationobserver.min.js'),
  path.resolve(__dirname, 'src/index.js'),
];

if (ifDevelopment()) {
  bundle.push(path.resolve(__dirname, 'src/init.js'));
}

module.exports = removeEmpty({
  entry: {
    'bundle.js': bundle,
  },

  output: {
    filename: ifProduction('cookiemonster.min.js'),
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.js/,
        use: ['babel-loader?cacheDirectory'],
        exclude: /node_modules/,
      },
    ],
  },

  devtool: ifDevelopment('eval-source-map', 'source-map'),

  devServer: ifDevelopment({
    host: 'localhost',
    port: 8080,
    overlay: true,
    stats: 'normal',
  }),

  plugins: removeEmpty([

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
    }),

    new HtmlWebpackPlugin({
      inject: 'head',
      template: 'src/index.html',
      environment: nodeEnv,
    }),

    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false
      },
      sourceMap: true
    }),

  ]),
});
