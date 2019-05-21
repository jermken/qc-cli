const logger = require('../lib/util/logger')
const fs = require('fs-extra')
const path = require('path')
const rimraf = require('rimraf')
const { spawn } = require('child_process')
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
        if(!require('../config/tpl.json')[`qc-${library}-${tool}-seed`]) {
            return logger.error(`template <${library}-${tool}> is not yet supported`)
        }
        if (fs.existsSync(path.join(process.env._CWD, `/${name}`))) {
            rimraf.sync(path.join(process.env._CWD, `/${name}`))
        }
        if(require('../package.json').dependencies[`@jermken/qc-${library}-${tool}-seed`]) {
            this.mkdir(name, library, tool)
        } else {
            let dir = path.resolve(__dirname, '../')
            let spinner = ora('project template loading... \n')
            spinner.start()
            let _spawn = spawn(`${dir.substr(0,2)} && cd ${dir} && npm install @jermken/qc-${library}-${tool}-seed@latest --save`, {shell: true})
            _spawn.stdout.on('data', (data) => {
                logger.log(data.toString())
            })
            _spawn.on('close', (code) => {
                if(code === 0) {
                    spinner.succeed()
                    this.mkdir(name, library, tool)
                } else {
                    spinner.fail()
                }
            })
        }
    },
    mkdir: function(name, library, tool) {
        fs.mkdir(path.join(process.env._CWD, `/${name}`), (err) => {
            if (err) {
                logger.error(err)
            } else {
                let _spinner = ora('project generating...')
                _spinner.start()
                copyTpl(path.resolve(__dirname, `../node_modules/@jermken/qc-${library}-${tool}-seed/template`), path.join(process.env._CWD, `/${name}`)).then(() => {
                    _spinner.succeed()
                    logger.success(`project generated successfully, please cd ${name}`)
                    this.qcConfigInit({title: name})
                }).catch(err => {
                    _spinner.fail()
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