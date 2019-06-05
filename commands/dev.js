const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
const ora = require('ora')
const tplMap = require('../config/tpl.json')
const logger = require('../lib/util/logger')

process.env.NODE_ENV = 'development'
process.env.CWD = process.cwd()
class DevCompiler {
    constructor(config) {
        this.config = config || {}
        let { lib, packer } = this.config
        this.seed = `qc-${lib}-${packer}-seed`
    }
    run() {
        let { lib, packer } = this.config
        if(!tplMap[this.seed]) return logger.error(`${lib}-${packer}: does not supported`)
        require(`@jermken/${tplMap[this.seed]}`).devRun()
    }
}

module.exports = (entry, cmd) => {
    let config;
    let configUrl = path.resolve(process.env.CWD, './config.js')
    let qcPackage = require('../package.json')
    let seed;
    if(fs.existsSync(configUrl)) {
        config = require(configUrl)
        seed = `qc-${config.lib}-${config.packer}-seed`
    } else {
        return logger.error(`file:${configUrl} is not found`)
    }
    if(!qcPackage.dependencies[`@jermken/${tplMap[seed]}`]) {
        let dir = path.resolve(__dirname, '../')
        let spinner = ora('qc-cli is updating... \n')
        spinner.start()
        let _spawn = spawn(`${dir.substr(0,2)} && cd ${dir} && npm install @jermken/${tplMap[seed]}@latest --save`, {shell: true})
        _spawn.stdout.on('data', (data) => {
            logger.log(data.toString())
        })
        _spawn.on('close', (code) => {
            if(code === 0) {
                spinner.succeed()
                new DevCompiler(config).run()
            } else {
                spinner.fail()
            }
        })
    } else {
        new DevCompiler(config).run()
    }
}