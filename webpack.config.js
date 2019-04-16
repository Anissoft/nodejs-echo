/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  node: {
    fs: 'empty',
  },
  devtool: 'source-map',
  entry: {
    main: './src/browser/index',
  },
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
    ],
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env.ENV': JSON.stringify(process.env.ENV),
    // }),
    new HtmlWebpackPlugin({
      title: 'Nodejs echo',
      favicon: './favicon.png'
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: './dist',
    compress: true,
    disableHostCheck: true,
    hot: false,
    port: 3002,
    historyApiFallback: {
      index: 'index.html',
    },
  },
};
