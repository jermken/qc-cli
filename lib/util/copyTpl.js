const fs = require('fs-extra')
const ora = require('ora')
const chalk = require('chalk')

module.exports = (src, dest) => {
    console.log(src, dest)
    return new Promise(resolve => {
        let spinner = ora('正在拷贝文件...')
        spinner.start()
        fs.copy(src, dest).then(() => {
            spinner.succeed()
            resolve()
        }).catch(err => {
            console.log(chalk.red(err))
            process.exit()
        })
    })
}