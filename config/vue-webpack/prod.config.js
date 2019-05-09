const path = require('path')
const merge = require('webpack-merge')
const htmlWebpackPlugin = require('html-webpack-plugin')
const cleanWebpackPlugin = require('clean-webpack-plugin')
const baseConf = require('./base.config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const _cwd = process.cwd()

module.exports = merge(baseConf, {
    mode: process.env.NODE_ENV,
    output: {
        path: path.join(_cwd, './dist'),
        filename: 'js/index.[hash:8].js'
    },
    module: {

    },
    plugins: [
        new cleanWebpackPlugin(['dist'], {root: _cwd}), // root 必配
        new MiniCssExtractPlugin({
            filename: 'css/main.[hash:8].css',
            chunkFilename: 'css/[name].[hash:8].css'
        }),
        new htmlWebpackPlugin({
            title: 'vue-demo',
            filename: 'index.html',
            template: path.join(_cwd, './src/entry/index.html'),
            chunks: ['index'],
            env: process.env.NODE_ENV,
            inject: true,
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        })
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            minChunks: 3
        }
    }
})
