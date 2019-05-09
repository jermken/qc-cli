const webpack = require('webpack')
const WebpackServer = require('webpack-dev-server')
const path = require('path')
process.env.NODE_ENV = 'development'
const webpackOptions = require('../config/vue-webpack/dev.config')
const { exec } = require('child_process')
module.exports = (entry, cmd) => {
    // exec(`${path.resolve(__dirname, '../node_modules/.bin/webpack-dev-server')} --config ${path.resolve(__dirname, '../config/vue-webpack/dev.config.js')}`, (err, stdout) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log(stdout)
    //     }
    // })
    const compiler = webpack(webpackOptions)
    const server = new WebpackServer(compiler)
    server.listen(8080)
}