const logger = require('../lib/util/logger')
const fs = require('fs-extra')
const path = require('path')
const rimraf = require('rimraf')
const ora = require('ora')
const { copyTpl } = require('../lib/util')
process.env._CWD = process.cwd()

let qcConfigInit = (config) => {
    let congfigUrl = path.resolve(process.env._CWD, `./${config.title}/qc.config.json`)
    let qcConfig = require(congfigUrl)
    qcConfig = { ...qcConfig, ...config}
    fs.writeFile(path.resolve(congfigUrl), JSON.stringify(qcConfig), 'utf-8', err => {
        if(err) logger.error(err)
    })
}
let generator = (projectName, library = 'vue', tool = 'webpack') => {
    if(!fs.existsSync(path.resolve(__dirname, `../template/${library}-${tool}`))) {
        return logger.error(`template <${library}-${tool}> is not yet supported`)
    }
    if (fs.existsSync(path.join(process.env._CWD, `/${projectName}`))) {
        rimraf.sync(path.join(process.env._CWD, `/${projectName}`))
    }
    fs.mkdir(path.join(process.env._CWD, `/${projectName}`), (err) => {
        if (err) {
            logger.error(err)
        } else {
            let spinner = ora('project generating...')
            spinner.start()
            copyTpl(path.resolve(__dirname, `../template/${library}-${tool}`), path.join(process.env._CWD, `/${projectName}`)).then(() => {
                spinner.succeed()
                logger.success('project generated successfully')
                qcConfigInit({title: projectName})
            }).catch(err => {
                spinner.fail()
                logger.error(err)
            })
        }
    })
}

module.exports = (entry, cmd) => {
    if (!cmd) {
        logger.error('project name is required')
        process.exit()
    } else {
        generator(entry, cmd.library, cmd.tool)
    }
}