const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const rimraf = require('rimraf')
const copyTpl = require('../lib/util/copyTpl')
const _cwd = process.cwd()
module.exports = (entry, cmd) => {
    if (!cmd) {
        console.log(chalk.red('error: 请指定项目名'))
        process.exit()
    } else {
        let projectName  = entry
        let library = cmd.library || 'vue'
        let tool = cmd.tool || 'webpack'
        console.log(projectName, library, tool)
        if (fs.existsSync(path.join(_cwd, `/${projectName}`))) {
            rimraf.sync(path.join(_cwd, `/${projectName}`))
        }
        fs.mkdir(path.join(_cwd, `/${projectName}`), (err) => {
            if (err) {
                console.log(chalk.red(err))
            } else {
                console.log('success')
                console.log(path.resolve(__dirname, '../template/vue-webpack'))
                copyTpl(path.resolve(__dirname, '../template/vue-webpack'), path.join(_cwd, `/${projectName}`)).then(() => {
                    console.log('copyed success')
                })
            }
        })
    }
}