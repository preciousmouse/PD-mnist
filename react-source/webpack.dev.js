const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const path = require('path');
const BASE_PATH = path.resolve(__dirname);
const BUILD_PATH = path.resolve(BASE_PATH,"build");

module.exports = merge(common,{
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: BUILD_PATH
    }
})