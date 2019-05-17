const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const baseConf = require('./base.config.js')

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
        new webpack.HotModuleReplacementPlugin()
    ]
})
