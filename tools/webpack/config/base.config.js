const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: {
        index: path.join(__dirname, './src/entry/index.js')
    },
    output: {
        chunkFilename: 'js/[name].bundle.[hash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(sc|c)ss$/,
                use: [
                    process.env.NODE_ENV !== 'production' ? 'vue-style-loader' : {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    }, 'css-loader', 'sass-loader'
                ]
            },
            {
                test: /\.(png|gif|jpg|svg|woff|eot|ttf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: '[name].[hash:8].[ext]',
                            outputPath: 'images'
                        }
                    },
                    'img-loader'
                ]
            }
        ]
    },
    plugins:[
        new VueLoaderPlugin()
    ],
    resolve: {
        extensions: ['.vue', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    externals: {
        'vue': 'Vue',
        'element-ui': 'ELEMENT'
    }
}