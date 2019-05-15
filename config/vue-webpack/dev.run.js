const webpack = require('webpack')
const WebpackServer = require('webpack-dev-server')
const open = require('open')
const url = require('url')
const merge = require('webpack-merge')
const fs = require('fs')
const path = require('path')

let webpackOptions
let configUrl = path.resolve(process.env._CWD, './config.dev.js')
if(fs.existsSync(configUrl)) {
    webpackOptions = merge(require(`./dev.config`), require(configUrl))
} else {
    webpackOptions = require(`./dev.config`)
}

module.exports = function() {
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