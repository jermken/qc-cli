const logger = require('../lib/util/logger')
const fs = require('fs-extra')
const path = require('path')
const rimraf = require('rimraf')
const ora = require('ora')
const { copyTpl } = require('../lib/util')
process.env._CWD = process.cwd()

let create = {
    qcConfigInit: function(config) {
        let congfigUrl = path.resolve(process.env._CWD, `./${config.title}/qc.config.json`)
        let qcConfig = require(congfigUrl)
        qcConfig = { ...qcConfig, ...config}
        fs.writeFile(path.resolve(congfigUrl), JSON.stringify(qcConfig), 'utf-8', err => {
            if(err) logger.error(err)
        })
    },
    generator: function(config) {
        let { name, library, tool } = config
        if(!fs.existsSync(path.resolve(__dirname, `../node_modules/@jermken/qc-${library}-${tool}-seed/template`))) {
            return logger.error(`template <${library}-${tool}> is not yet supported`)
        }
        if (fs.existsSync(path.join(process.env._CWD, `/${name}`))) {
            rimraf.sync(path.join(process.env._CWD, `/${name}`))
        }
        fs.mkdir(path.join(process.env._CWD, `/${name}`), (err) => {
            if (err) {
                logger.error(err)
            } else {
                let spinner = ora('project generating...')
                spinner.start()
                copyTpl(path.resolve(__dirname, '../node_modules/@jermken/qc-vue-webpack-seed/template'), path.join(process.env._CWD, `/${name}`)).then(() => {
                    spinner.succeed()
                    logger.success(`project generated successfully, please cd ${name}`)
                    this.qcConfigInit({title: name})
                }).catch(err => {
                    spinner.fail()
                    logger.error(err)
                })
            }
        })
    }
}

module.exports = (config) => {
    if (!config.name) {
        logger.error('project name is required')
        process.exit(1)
    } else {
        create.generator(config)
    }
}