const logger = require('../lib/util/logger')
const fs = require('fs-extra')
const path = require('path')
const rimraf = require('rimraf')
const { spawn } = require('child_process')
const ora = require('ora')
const tplMap = require('../config/tpl.json')
const { copyTpl } = require('../lib/util')
process.env.CWD = process.cwd()

let create = {
    isGitRepos: false,
    qcConfigInit: function(config) {
        let packageUrl;
        if(this.isGitRepos) {
            packageUrl = path.resolve(process.env.CWD, `./package.json`)
        } else {
            packageUrl = path.resolve(process.env.CWD, `./${config.title}/package.json`)
        }
        let packageInfo = require(packageUrl)
        packageInfo.name = config.title
        fs.writeFile(path.resolve(packageUrl), JSON.stringify(packageInfo), 'utf-8', err => {
            if(err) logger.error(err)
        })
    },
    /**
     *
     * @param {*} config project config
     */
    generator: function(config) {
        let { lib, packer } = config
        let seed = `qc-${lib}-${packer}-seed`
        if(!tplMap[seed]) {
            return logger.error(`template <${lib}-${packer}> is not yet supported`)
        }
        // judge the cwd is a git repository?
        if(fs.existsSync(path.join(process.env.CWD, `/.git`))) this.isGitRepos = true

        if(require('../package.json').dependencies[`@jermken/${tplMap[seed]}`]) {
            this.mkdir(config)
        } else {
            let dir = path.resolve(__dirname, '../')
            let spinner = ora('project template loading... \n')
            spinner.start()
            let _spawn = spawn(`${dir.substr(0,2)} && cd ${dir} && npm install @jermken/${tplMap[seed]}@latest --save`, {shell: true})
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
                    this.mkdir(config)
                } else {
                    spinner.fail()
                }
            })
        }
    },
    /**
     *
     * @param {String} name the project name
     * @param {String} lib a framework which you will use in your project
     * @param {String} packer a packer tool which you will use in your project
     */
    mkdir: function(options) {
        let { name, lib, packer, typescript } = options
        let seed = `qc-${lib}-${packer}-seed`
        let tplPath = typescript === 'true' ? `${tplMap[seed]}/template/${lib}-${packer}-ts` : `${tplMap[seed]}/template/${lib}-${packer}`
        if(!fs.existsSync(tplPath)) {
            return logger.error(`暂不支持 ${lib}-${packer}-ts 类型项目`)
        }
        if(this.isGitRepos) {
            let _spinner = ora('project generating...')
            _spinner.start()
            copyTpl(path.resolve(__dirname, `../node_modules/@jermken/${tplPath}`), process.env.CWD).then(() => {
                _spinner.succeed()
                logger.success(`project generated successfully, you can run <qc dev> to start your development`)
                this.qcConfigInit({title: name})
            }).catch(err => {
                _spinner.fail()
                logger.error(err)
            })
            return
        }
        if (fs.existsSync(path.join(process.env.CWD, `/${name}`))) {
            rimraf.sync(path.join(process.env.CWD, `/${name}`))
        }
        fs.mkdir(path.join(process.env.CWD, `/${name}`), (err) => {
            if (err) {
                logger.error(err)
            } else {
                let _spinner = ora('project generating...')
                _spinner.start()
                copyTpl(path.resolve(__dirname, `../node_modules/@jermken/${tplPath}`), path.join(process.env.CWD, `/${name}`)).then(() => {
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