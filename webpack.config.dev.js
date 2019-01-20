import path from 'path'

function resolve(dir) {
  return path.resolve(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './test/src/index.js'
  },
  output: {
    path: './test/dist',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  module: {
    rules: [

    ]
  },
  devServer: {
    hot: true,
    compress: true,
    host: 'localhost',
    port: 9091,
    open: !!npm_config_open
  }
}
