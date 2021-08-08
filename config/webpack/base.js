const { webpackConfig } = require("@rails/webpacker")
const { merge } = require('webpack-merge')
const ForkTSCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = merge(webpackConfig, {
  plugins: [
    new ForkTSCheckerWebpackPlugin(),
    new MonacoWebpackPlugin({languages: ['json']})
  ],
  resolve: {
    extensions: [".tsx"],
  }
})
