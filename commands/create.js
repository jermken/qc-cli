const logger = require('../lib/util/logger')
const fs = require('fs-extra')
const path = require('path')
const rimraf = require('rimraf')
const { spawn } = require('child_process')
const ora = require('ora')
const { copyTpl } = require('../lib/util')
process.env._CWD = process.cwd()

let create = {
    isGitRepos: false,
    qcConfigInit: function(config) {
        let congfigUrl;
        if(this.isGitRepos) {
            congfigUrl = path.resolve(process.env._CWD, `./qc.config.json`)
        } else {
            congfigUrl = path.resolve(process.env._CWD, `./${config.title}/qc.config.json`)
        }
        let qcConfig = require(congfigUrl)
        qcConfig = { ...qcConfig, ...config}
        fs.writeFile(path.resolve(congfigUrl), JSON.stringify(qcConfig), 'utf-8', err => {
            if(err) logger.error(err)
        })
    },
    /**
     *
     * @param {*} config project config
     */
    generator: function(config) {
        let { name, library, tool } = config
        if(!require('../config/tpl.json')[`qc-${library}-${tool}-seed`]) {
            return logger.error(`template <${library}-${tool}> is not yet supported`)
        }
        // judge the cwd is a git repository?
        if(fs.existsSync(path.join(process.env._CWD, `/.git`))) this.isGitRepos = true

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
            _spawn.stderr.on('data', (data) => {
                let info = data.toString()
                if(info.indexOf('error') > -1 || info.indexOf('ERROR') > -1) {
                    logger.error(info)
                } else if(info.indexOf('warn') > -1 || info.indexOf('WARN') > -1) {
                    logger.warn(info)
                }
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
    /**
     *
     * @param {String} name the project name
     * @param {String} library a framework which you will use in your project
     * @param {String} tool a packer tool which you will use in your project
     */
    mkdir: function(name, library, tool) {
        if(this.isGitRepos) {
            let _spinner = ora('project generating...')
            _spinner.start()
            copyTpl(path.resolve(__dirname, `../node_modules/@jermken/qc-${library}-${tool}-seed/template`), process.env._CWD).then(() => {
                _spinner.succeed()
                logger.success(`project generated successfully, you can run <qc dev> to start your development`)
                this.qcConfigInit({title: name})
            }).catch(err => {
                _spinner.fail()
                logger.error(err)
            })
            return
        }
        if (fs.existsSync(path.join(process.env._CWD, `/${name}`))) {
            rimraf.sync(path.join(process.env._CWD, `/${name}`))
        }
        fs.mkdir(path.join(process.env._CWD, `/${name}`), (err) => {
            if (err) {
                logger.error(err)
            } else {
                let _spinner = ora('project generating...')
                _spinner.start()
                copyTpl(path.resolve(__dirname, `../node_modules/@jermken/qc-${library}-${tool}-seed/template`), path.join(process.env._CWD, `/${name}`)).then(() => {
                    _spinner.succeed()
                    logger.success(`project generated successfully, please cd ${name} ,and you can run <qc dev> to start your development`)
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