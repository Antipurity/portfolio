const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin")
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  mode: 'development',
  context: path.join(__dirname, 'src'),
  entry: {
    main: './index.js',
    2048: './small_projects/2048/2048.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      filename: '2048.html',
      template: 'small_projects/2048/index.html',
      chunks: ['2048'],
    }),
    new MiniCssExtractPlugin,
    // new TerserPlugin,
  ],
  resolve: {
    modules: [
        path.join(__dirname, 'node_modules'),
    ],
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new HtmlMinimizerPlugin,
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
}