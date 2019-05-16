const fs = require('fs-extra')
const logger = require('./logger')

let copyTpl = (src, dest) => {
    return new Promise(resolve => {
        fs.copy(src, dest).then(() => {
            resolve()
        }).catch(err => {
            logger.error(err)
            process.exit(1)
        })
    })
}
module.exports = {
    copyTpl
}