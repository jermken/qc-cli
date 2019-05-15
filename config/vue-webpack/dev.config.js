const path = require('path')
const merge = require('webpack-merge')
const htmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const baseConf = require('./base.config.js')
const qcConfig = require(path.resolve(process.cwd(), './qc.config.json'))

module.exports = merge(baseConf, {
    mode: process.env.NODE_ENV,
    output: {
        path: path.join(process.env._CWD, './dist'),
        filename: 'index.js'
    },
    module: {

    },
    devServer: {
        contentBase: path.join(process.env._CWD, './dist'),
        historyApiFallback: true,
        hot: true,
        port: 8080,
        open: true,
        inline: true,
        progress: true,
        quiet: true
    },
    devtool: 'inline-source-map',
    plugins: [
        new friendlyErrorsWebpackPlugin({
            messages: ['compiled successfully.']
        }),
        new htmlWebpackPlugin({
            title: qcConfig.title,
            filename: './index.html',
            template: path.resolve(process.env._CWD, './src/entry/index.html'),
            chunks: ['index'],
            env: process.env.NODE_ENV,
            inject: false,
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
})
