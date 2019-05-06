const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
module.exports = {
    rootPath: '',
    clearDir(rootPath) {
        this.rootPath = rootPath
        this.rmDir(rootPath)
    },
    rmDir1(filePath) {
        fs.readdir(filePath, (err, files) => {
            if (err) {
                console.log(chalk.red(err))
            } else {
                if(!files || !files.length) {
                    fs.rmdir(filePath, (err) => {
                        if (!err) {
                            console.log(`${filePath}/../`)
                            // this.rmDir(`${filePath}/../`)
                        }
                    })
                } else {
                    files.forEach(dirname => {
                        let dirPath = path.resolve(filePath, dirname)
                        this.rmDir(dirPath)
                    })
                }
            }
        })
        // fs.readdir(filePath, (err, files) => {
        //     if (err) {
        //         console.log(chalk.red(err))
        //     } else {
        //         if (!files || !files.length) {
        //             fs.rmdirSync(filePath)
        //         } else {
        //             files.forEach(filename => {
        //                 let _filePath = path.resolve(filePath, filename)
        //                 console.log(_filePath)
        //                 fs.stat(_filePath, (err, stats) => {
        //                     if (err) {
        //                         console.log(chalk.red(err))
        //                     } else {
        //                         let isFile = stats.isFile()
        //                         let isDir = stats.isDirectory()
        //                         if (isFile) {
        //                             fs.unlinkSync(_filePath)
        //                         }
        //                         if (isDir) {
        //                             this.rmDir(_filePath)
        //                         }
        //                     }
        //                 })
        //             })
        //         }
        //     }
        // })
    },
    rmDir(filePath) {
        let files = fs.readdirSync(filePath) || []
        if (!files.length) {
            fs.rmdirSync(filePath)
            if (filePath === this.rootPath) {
                return
            } else {
                let _path = path.resolve(filePath, '../')
                this.rmDir(_path)
            }
        }
        files.forEach(filename => {
            let _filePath = path.resolve(filePath, filename)
            console.log(_filePath)
            let stats = fs.statSync(_filePath)
            let isFile = stats.isFile()
            let isDir = stats.isDirectory()
            if (isFile) {
                fs.unlinkSync(_filePath)
                let _path = path.resolve(_filePath, '../')
                this.rmDir(_path)
            }
            if (isDir) {
                this.rmDir(_filePath)
            }
        })
    }
}