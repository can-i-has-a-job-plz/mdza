process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const webpackConfig = require('./base')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const { merge } = require('webpack-merge')

module.exports = merge(webpackConfig, {
  plugins: [
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin()
  ],
  devServer: {
    proxy: {
      '/api/cable': {
        target: 'http://localhost:3000',
        ws: true
      },
      '/api': 'http://localhost:3000',
    }
  }
})

console.log(JSON.stringify(module.exports))
