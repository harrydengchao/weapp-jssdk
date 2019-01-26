'use strict'
const path = require('path')
const config = require('../config')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const srcList = [
  resolve('test'),
]

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    bundle: process.env.NODE_ENV === 'production' ? './lib/index.js' : './test/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@lib': resolve('lib')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          ...srcList,
          resolve('node_modules/webpack-dev-server/client')
        ]
      }
    ]
  },
  node: {
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
