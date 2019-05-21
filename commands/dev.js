const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
const ora = require('ora')
const logger = require('../lib/util/logger')
process.env.NODE_ENV = 'development'
process.env._CWD = process.cwd()
class DevCompiler {
    constructor(config) {
        this.config = config || {}
        this.configFileMap = {
            'vue-webpack': require('@jermken/qc-vue-webpack-seed').devRun
        }
    }
    run() {
        let { lib, packer } = this.config
        if(!this.configFileMap[`${lib}-${packer}`]) return logger.error(`${lib}-${packer}: does not exist in configFileMap`)
        this.configFileMap[`${lib}-${packer}`]()
    }
}

module.exports = (entry, cmd) => {
    let config;
    let configUrl = path.resolve(process.env._CWD, './qc.config.json')
    let qcPackage = require('../package.json')
    if(fs.existsSync(configUrl)) {
        config = require(configUrl)
    } else {
        return logger.error(`file:${configUrl} is not found`)
    }
    if(!qcPackage.dependencies[`@jermken/qc-${config.lib}-${config.packer}-seed`]) {
        let dir = path.resolve(__dirname, '../')
        let spinner = ora('qc-cli is updating... \n')
        spinner.start()
        let _spawn = spawn(`${dir.substr(0,2)} && cd ${dir} && npm install @jermken/qc-${config.lib}-${config.packer}-seed@latest --save`, {shell: true})
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