const webpack = require('webpack')
const WebpackServer = require('webpack-dev-server')
const open = require('open')
const url = require('url')
process.env.NODE_ENV = 'development'
const webpackOptions = require('../config/vue-webpack/dev.config')
const chalk = require('chalk')
module.exports = (entry, cmd) => {
    const compiler = webpack(webpackOptions)
    const server = new WebpackServer(compiler, {...webpackOptions.devServer})
    let { port, host, protocol } = webpackOptions.devServer
    port = port || 8080
    host = host || '127.0.0.1'
    protocol = protocol || 'http'
    let uri = url.format({
        protocol,
        hostname: host,
        port
    })
    server.listen(port, host, () => {
        open(uri)
    })
}