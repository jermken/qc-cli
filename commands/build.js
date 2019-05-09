
const path = require('path')
const chalk = require('chalk')
const { spawn } = require('child_process')
module.exports = (entry, cmd) => {
    process.env.NODE_ENV = 'production'
    let _spawn = spawn(`${path.resolve(__dirname, '../node_modules/.bin/webpack')} --config ${path.resolve(__dirname, '../config/vue-webpack/prod.config.js')}`, {shell: true})
    _spawn.stdout.on('data', (data) => {
        console.log(chalk.green(data.toString()))
    })
    _spawn.on('error', (err) => {
        console.log('error')
        console.log(err)
    })
}