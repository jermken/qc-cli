const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
const ora = require('ora')
const { SEEDLIST } = require('../config/globalConst')
const logger = require('../lib/util/logger')

process.env.NODE_ENV = 'development'
process.env.CWD = process.cwd()
class DevCompiler {
    constructor({config, option}) {
        this.config = config || {}
        this.option = option || {}
        let { packer } = this.config
        this.seed = `qc-${packer}-seed`
    }
    run() {
        let { lib, packer } = this.config
        if(!SEEDLIST.includes(this.seed)) return logger.error(`${lib}-${packer}: does not supported`)

        // need run npm install before run qc dev?
        if(fs.existsSync(path.resolve(process.env.CWD, './node_modules'))) {
            require(`@jermken/${this.seed}`).devRun(this.option)
        } else {
            let _spawn = spawn(`cd ${process.env.CWD} && npm install`, {shell: true})
            _spawn.stdout.on('data', (data) => {
                logger.log(data.toString())
            })
            _spawn.on('close', (code) => {
                if(code === 0) {
                    require(`@jermken/${this.seed}`).devRun(this.option)
                }
            })
        }
    }
}

module.exports = (entry, option) => {
    let config;
    let configUrl = path.resolve(process.env.CWD, './config.js')
    if(fs.existsSync(configUrl)) {
        config = require(configUrl)
    } else {
        return logger.error(`file:${configUrl} is not found`)
    }
    new DevCompiler({config, option}).run()
}