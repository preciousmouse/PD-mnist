const path = require('path')
const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");

const config = require("../webpack.dev");
const devServer = {
    contentBase: [
        path.resolve(__dirname,'../src/'),
        path.resolve(__dirname,'../common/')
    ],
    historyApiFallback: true,
    hot: true,
    port: 8099,
    noInfo: false
};
config.entry.index.unshift('webpack-dev-server/client?http://localhost:'+devServer.port);

const compiler = webpack(config);
webpackDevServer.addDevServerEntrypoints(config, devServer);
new webpackDevServer(compiler,devServer)
.listen(devServer.port,'localhost',(err)=>{
    if(err){
        console.log(err);
    }
    console.log("Listening on localhost:"+devServer.port);
});

compiler.plugin('done',()=>{
    setTimeout(() => {
        console.log("ready");
        console.log("iframe mode on http://loacalhost:"+devServer.port+"/webpack-dev-server");
        console.log("inline mode on http://localhost:"+devServer.port+'/');
    }, 500);
})