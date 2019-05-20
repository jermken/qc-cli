const path = require('path')
const fs = require('fs')
const logger = require('../lib/util/logger')
process.env.NODE_ENV = 'production'
process.env._CWD = process.cwd()
class ProdCompiler {
    constructor(config) {
        this.config = config || {}
        this.configFileMap = {
            'vue-webpack': require('@jermken/qc-vue-webpack-seed').prodRun
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
    if(fs.existsSync(configUrl)) {
        config = require(configUrl)
    } else {
        return logger.error(`file:${configUrl} is not found`)
    }
    let compiler = new ProdCompiler(config)
    compiler.run()
}