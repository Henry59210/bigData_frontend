const path = require("path")

const HtmlWebpackPlugin = require("html-webpack-plugin")
const { stat } = require("fs")
module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
             {
                test: /\.css$/, // 匹配.less结尾的文件
                use: ['style-loader','css-loader'],
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html')
        })
    ],
    devServer: {
        port: 8080,
        proxy: {
            '/api/v2': {
                target: 'http://20.2.129.187:8080', // 这里可以跟随项目实际部署服务器来
                // changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
                pathRewrite: {
                  '^/api/v2': '', // 自定义
                },
              },
        }
    }
}