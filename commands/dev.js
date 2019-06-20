const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')
const ora = require('ora')
const { SEEDLIST } = require('../config/globalConst')
const logger = require('../lib/util/logger')

process.env.NODE_ENV = 'development'
process.env.CWD = process.cwd()
class DevCompiler {
    constructor(config) {
        this.config = config || {}
        let { packer } = this.config
        this.seed = `qc-${packer}-seed`
    }
    run(options) {
        let { lib, packer } = this.config
        if(!SEEDLIST.includes(this.seed)) return logger.error(`${lib}-${packer}: does not supported`)

        // need run npm install before run qc dev?
        if(fs.existsSync(path.resolve(process.env.CWD, './node_modules'))) {
            require(`@jermken/${this.seed}`).devRun(options)
        } else {
            let _spawn = spawn(`cd ${process.env.CWD} && npm install`, {shell: true})
            _spawn.stdout.on('data', (data) => {
                logger.log(data.toString())
            })
            _spawn.on('close', (code) => {
                if(code === 0) {
                    require(`@jermken/${this.seed}`).devRun(options)
                }
            })
        }
    }
}

module.exports = (entry, options) => {
    let config;
    let configUrl = path.resolve(process.env.CWD, './config.js')
    let qcPackage = require('../package.json')
    let seed;
    if(fs.existsSync(configUrl)) {
        config = require(configUrl)
        seed = `qc-${config.packer}-seed`
    } else {
        return logger.error(`file:${configUrl} is not found`)
    }
    if(!qcPackage.dependencies[`@jermken/${seed}`]) {
        // TODO: 暂未兼容linux系统 暂时关闭，后期可优化。
        // let dir = path.resolve(__dirname, '../')
        // let spinner = ora('qc-cli is updating... \n')
        // spinner.start()
        // let _spawn = spawn(`${dir.substr(0,2)} && cd ${dir} && npm install @jermken/${seed}@latest --save`, {shell: true})
        // _spawn.stdout.on('data', (data) => {
        //     logger.log(data.toString())
        // })
        // _spawn.on('close', (code) => {
        //     if(code === 0) {
        //         spinner.succeed()
        //         new DevCompiler(config).run(options)
        //     } else {
        //         spinner.fail()
        //     }
        // })
    } else {
        new DevCompiler(config).run(options)
    }
}