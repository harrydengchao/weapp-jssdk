const path = require('path')

const testConfig = {
  input: 'test/src/index.js',
  output: {
    file: 'test/dist/bundle.js',
    format: 'cjs'
  }
}

const prodConfig = {

}

export default process.env.NODE_ENV === 'testing'
  ? testConfig
  : prodConfig
