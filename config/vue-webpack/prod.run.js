const logger = require('../../lib/util/logger')
const ora = require('ora')
const webpack = require('webpack')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const merge = require('webpack-merge')
const fs = require('fs')
const path = require('path')
let webpackOptions
let configUrl = path.resolve(process.env._CWD, './config.prod.js')

if(fs.existsSync(configUrl)) {
    webpackOptions = merge(require(`./prod.config`), require(configUrl))
} else {
    webpackOptions = require(`./prod.config`)
}

module.exports = function() {
    const compiler = webpack(webpackOptions)
    let spinner = ora('')
    spinner.start();
    (new ProgressPlugin((percentage) => {
        spinner.text = `compiling... ${(percentage * 100).toFixed(0)}%`
    })).apply(compiler)
    compiler.run((err) => {
        if(err) {
            spinner.fail()
            logger.error(err)
        } else {
            spinner.succeed()
            logger.success('compiled successfully')
        }
    })
}