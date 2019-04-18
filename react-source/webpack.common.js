/*
 * @Author: preciousmouse 
 * @Date: 2018-12-18 17:23:17 
 * @Last Modified by: preciousmouse
 * @Last Modified time: 2019-04-02 21:28:55
 */

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BASE_PATH = path.resolve(__dirname);
const BUILD_PATH = path.resolve(BASE_PATH,"build");
const SRC_PATH = path.resolve(BASE_PATH,'src');
const TEMPLATE_PATH = path.resolve(BASE_PATH,'templates');

module.exports = {
    entry: {
		index: [path.resolve(SRC_PATH,'index/index.jsx')],
		mnist: [path.resolve(SRC_PATH,'mnist/mnist.jsx')],
    },
    output: {
        path: path.resolve(BUILD_PATH,'index'),
        filename: '[name].js',
    },
    module:{
        rules:[
            {
                test: /\.jsx$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader,'css-loader','sass-loader'],
            },
            {
                test: /\.css$/, 
				use: [MiniCssExtractPlugin.loader,'css-loader'],
				// use: ['css-loader']
            },
            {
                test: /\.(png|jpg|jpeg|gif|bmp)$/,
                loader: 'url-loader',
            }
        ]
    },
    plugins:[
        new CleanWebpackPlugin([BUILD_PATH]),
        new MiniCssExtractPlugin('[name].css'),
        new HtmlWebpackPlugin({
            title: "emmm",
			template: path.resolve(TEMPLATE_PATH,'index.html'),
			chunks: ['index'],
            filename: "index.html"
		}),
		new HtmlWebpackPlugin({
            title: "mnist",
			template: path.resolve(TEMPLATE_PATH,'index.html'),
			chunks: ['mnist'],
            filename: "mnist.html"
        }),
    ]
}