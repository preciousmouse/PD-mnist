var http = require("http");
var fs = require("fs");
var querystring = require("querystring");
/**
 * 标识上传文件的类
 * @param filename 文件名
 * @param filepath 文件路径
 * @constructor
 */
function File(filename, filepath) {
    this.filename = filename;
    this.filepath = filepath;
    this._buffer = null;
}

/**
 * 获取文件的Buffer流
 */
File.prototype.getBuffer = function () {
    if (!this._buffer) {
        this._buffer = fs.readFileSync(this.filepath);
    }
    return this._buffer;
}
/**
 * http封装的访问工具类
 * @constructor
 */
function HttpUtil() {
    this.boundary = this._generateBoundary();
}

/**
 * 模拟post请求数据，可以用于上传文件
 * @param url 接口url
 * @param data 访问的数据json对象，如果有上传的文件请调用模块中的file方法
 * @param formdata 是否上传文件true,false,如果不上传文件请填写false
 * @param callback 回调，第一个参数为是否成功true/false,第二个参数为数据或失败时的错误
 */
HttpUtil.prototype.post = function (url, data, formdata, callback) {
    var url = url.replace("http://", "");
    var urlArray = url.split("/");
    var host = urlArray[0].split(":")[0];
    var port = urlArray[0].split(":").length > 1 ? urlArray[0].split(":")[1] : 80;
    urlArray[0] = "";
    var path = urlArray.join("/");

    var options = {
        method: "POST",
        host: host,
        port: port,
        path: path,
        headers: {
            "Content-Type": formdata ? ("multipart/form-data; boundary=" + this.boundary) : "application/x-www-form-urlencoded; charset=UTF-8"
        }
    };
    var req = http.request(options, function (res) {
        res.on("data", function (data) {
            if (typeof callback == "function") {
                callback(true, data);
            }
        });
    });
    // req.setTimeout(3000,function(){
    //     // var e = new Error('http request timeout url: '+host+':'+port);
    //     // e.code = 'ESOCKETTIMEOUT',
    //     // e.connect = false;
    //     // this.emit('error',e);
    //     this.abort();
    // })
    req.on("error", function (error) {
        if (typeof callback == "function") {
            callback(false, error);
        }
    });
    if (formdata) {
        for (var key in data) {
            if (data[key] instanceof File) {
                req.write(this._structureFileContent(key, data[key]));
                req.write(data[key].getBuffer());
            } else {
                req.write(this._structureBasicContent(key, data[key]));
            }
        }
        req.write('\r\n--' + this.boundary + '--\r\n');
    } else {
        req.write(querystring.stringify(data));
    }
    req.end();
};
/**
 * 构建基本http请求参数
 * @param name 名字
 * @param value 值
 * @param content 要拼接的字符串
 * @private
 */
HttpUtil.prototype._structureBasicContent = function (name, value) {
    var content = '--' + this.boundary
        + '\r\n'
        + 'Content-Disposition: form-data; name="' + name + '"'
        + '\r\n\r\n'
        + value
        + '\r\n';
    return content;
};
/**
 * 构建http上传文件的请求参数
 * @param file File对象
 * @param content 要拼接的content
 * @private
 */
HttpUtil.prototype._structureFileContent = function (name, file) {
    if (file instanceof File) {
        var content = '--' + this.boundary
            + '\r\n'
            + 'Content-Disposition: form-data; name="' + name + '"; filename="' + encodeURIComponent(file.filename) + '"'
            + '\r\n'
            + 'Content-Type: application/octet-stream'
            + '\r\n\r\n';
        return content;
    }
    throw new Error("请传入File对象!");
};
/**
 *生成Boundary分割符
 * @private
 */
HttpUtil.prototype._generateBoundary = function () {
    return "---------------------------" + Math.random().toString(32);
};
/**
 * 创建上传的File对象
 * @param filename 文件名
 * @param filepath 文件路径
 * @returns {File} File对象
 */
HttpUtil.prototype.file = function (filename, filepath) {
    return new File(filename, filepath);
};
module.exports = new HttpUtil();