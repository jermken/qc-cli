const chalk = require('chalk')
const ora = require('ora')
const webpack = require('webpack')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
process.env.NODE_ENV = 'production'
const webpackOptions = require('../config/vue-webpack/prod.config')


module.exports = (entry, cmd) => {
    const compiler = webpack(webpackOptions)
    let spinner = ora().start();
    (new ProgressPlugin((percentage, msg) => {
        spinner.text = `compiling... ${(percentage * 100).toFixed(0)}%`
    })).apply(compiler)
    compiler.run((err) => {
        if(err) {
            console.log(chalk.red(err))
            spinner.fail()
        } else {
            spinner.succeed()
            console.log(chalk.green('compiled successfully'))
        }
    })
}