const chalk = require('chalk')

class Logger {
    constructor() {}
    log(msg) {
        console.log(msg)
    }
    success(msg) {
        console.log(chalk.green(msg))
    }
    fail(msg) {
        console.log(chalk.red(`fail: ${msg} \n`))
    }
    error(msg) {
        console.log(chalk.red(`error: ${msg} \n`))
    }
    warn(msg) {
        console.log(chalk.yellow(`warning: ${msg} \n`))
    }
    info(msg) {
        console.log(chalk.grey(msg))
    }
}

module.exports = new Logger()