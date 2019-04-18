var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var request = require('request');
var httpUtil = require('./httputil');
var uuid = require('uuid');
var Predict = require(path.resolve(__dirname,'../models/predict.js'));
var Mnist = require(path.resolve(__dirname,'../models/mnist.js'));
// var _ = require('lodash');
var formidable = require('formidable');

var config = require('../config');
var predictStatus = ['pending','finished','failed'];
var modelPerformance = [{
	precision: '0.1',
	recall: '100%',
	accurate: '98.46%',
},{
	precision: '0.1',
	recall: '100%',
	accurate: '28.70%',
}]

function createPredict(param,callback){
	var predict = new Predict({
		predictId: param.predictId,
		uploadUrl: param.uploadUrl,
		code: 0,
		status: predictStatus[0],
	});
	predict.save(function(err,res){
		if(err){
			console.log('insert err:',err);
			callback&&callback(err);
		}
		// console.log('insert suc:',res);
		callback&&callback(res);
	})
}
function updatePredict(param,callback){
	var origin = {
		predictId:param.predictId
	};
	// var id = param.predictId;
	var aim = {
		predictId: param.predictId,
		code: param.code,
		status: predictStatus[param.code],
		predictUrl: param.predictUrl,
		negTumorsCount: param.negTumorsCount,
		posTumorsCount: param.posTumorsCount,
	};
	// console.log('update to:',aim);
	Predict.findOneAndUpdate(origin,aim,{new:true},function(err,res){
		if(err){
			console.log('update err:',err);
			callback&&callback(err);
		}
		// console.log('update suc:',res);
		callback&&callback(res);
	})
}
function getPredictList(setting,callback){
	var pageSize = setting.pageSize||10;
	var currentPage = setting.currentPage||1;
	var sort = {'createdAt':-1};
	var condition = {};
	var skipnum = (currentPage-1)*pageSize;

	Predict.find(condition,'-_id -__v').skip(skipnum).limit(pageSize).sort(sort)
		.exec(function(err,res){
			if(err){
				console.log('get error:',err);
				callback&&callback(err);
			}
			// console.log('get suc:',res);
			callback&&callback(res);
		})
}
function emptyPredict(callback){
	Predict.remove({},function(err,res){
		callback&&callback(res);
	})
}

function saveUploadFile(req,filename,uploadpath,callback){
	filename = filename||uuid.v1();
	uploadpath = uploadpath||path.resolve(__dirname,'../public/uploads/');

	var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../cache');//文件保存的临时目录为根项目下的cache文件夹
    form.maxFieldsSize = 10 * 1024 * 1024;  //用户头像大小限制为最大10M  
    form.keepExtensions = true;        //使用文件的原扩展名
    form.parse(req, (err, fields, file)=> {
        var filePath = '';
        //如果提交文件的form中将上传文件的input名设置为tmpFile，就从tmpFile中取上传文件。否则取for in循环第一个上传的文件。
        if(file.tmpFile){
            filePath = file.tmpFile.path;
        } else {
            for(var key in file){
                if( file[key].path && filePath==='' ){
                    filePath = file[key].path;
                    break;
                }
            }
        }
        //文件移动的目录文件夹，不存在时创建目标文件夹
        var targetDir = uploadpath;//path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(targetDir)) {
            fs.mkdir(targetDir);
        }
        var fileExt = filePath.substring(filePath.lastIndexOf('.'));
        //判断文件类型是否允许上传
        if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
            var err = new Error('此文件类型不允许上传');
            // return {code:-1, message:'此文件类型不允许上传'};
            callback({code:-1, message:'此文件类型不允许上传'});
        } else {
            //以当前时间戳对上传文件进行重命名
            var fileName = filename+fileExt;//new Date().getTime() + fileExt;
            var targetFile = path.join(targetDir, fileName);
            //移动文件
            fs.rename(filePath, targetFile, function (err) {
                if (err) {
                    console.info(err);
                    // return ({code:-2, message:'保存失败'});
                    callback({code:-2, message:'保存失败'});
                } else {
                    //上传成功，返回文件的相对路径
                    var fileUrl = path.resolve(__dirname,'../public/uploads/'+fileName);
                    // return ({code:0, fileUrl:fileUrl,fileName:fileName});
                    callback({code:0, fileUrl:fileUrl,fileName:fileName});
                }
            });
        }
    });
}
function downloadFile(linkUrl,savepath,callback){
	savepath = savepath||path.resolve(__dirname,'../public/prediction/');
	let filename = linkUrl.split('/').pop();
	let savefile = path.join(savepath,filename);
	console.log(savefile)
	request(linkUrl).pipe(fs.createWriteStream(savefile)).on('close',data=>{
		let route = savefile.replace('\\','/').split('public').pop();//将文件目录映射到http请求url上
		let fileUrl = 'http://'+config.host+':'+config.port+route;
		callback({
			code: 0,
			fileUrl: fileUrl
		});
	})
}

router.get('/', function(req, res, next) {
  res.sendFile(path.resolve(__dirname,'../views/index.html'));
});
router.post('/predict',function(req,res,next){
	//get picture uploaded
	let fileuid = uuid.v1();
	saveUploadFile(req,fileuid,null,(data)=>{
		// console.log('save',data);
		if(!data){
			res.json({
				code: -2,
				message: 'save error'
			})
			return;
		}
		if(data.code!==0){
			res.json(data);
			return;
		}

		let {fileName,fileUrl} = data;

		let port='5000',host='127.0.0.1';//'192.168.153.128';
		let url = "http://"+host+':'+port+'/predict';

		//带文件上传的使用案例,result true/false，请求成功/失败
		httpUtil.post(url, {
			'image': httpUtil.file(fileName, fileUrl),
		}, true, (result, data)=> {
			console.log('get data',{res:result,data:data.toString()})
			if(result){
				let url = JSON.parse(data.toString()).prediction.replace('\\','/');
				let negCnt = JSON.parse(data.toString()).neg_tumors_count;
				let posCnt = JSON.parse(data.toString()).pos_tumors_count;
				downloadFile(url,null,(data)=>{
					updatePredict({
						predictId: fileuid,
						code: 1,
						predictUrl: data.fileUrl,
						negTumorsCount: negCnt,
						posTumorsCount: posCnt,
					})
				})
			}else{
				updatePredict({
					predictId: fileuid,
					code: 2,
				})
			}
		});
		// test
		// setTimeout((fileuid)=>{
		// 	updatePredict({
		// 		predictId: fileuid,
		// 		code: 1,
		// 		predictUrl: "http://192.168.153.128:5000/predictions/6cce85bd-33e9-4127-a25c-5afcdc7a990c.png",
		// 	})
		// },3000,fileuid);

		let route = fileUrl.replace('\\','/').split('public').pop();//将文件目录映射到http请求url上
		let uploadUrl = 'http://'+config.host+':'+config.port+route;
		// console.log('upload',uploadUrl);
		console.log('start predict: '+fileuid);
		createPredict({
			predictId:fileuid,
			uploadUrl: uploadUrl,
		},function(data){
			// console.log(data);
			res.json({
				code: 0,
				message: 'requested',
				data:{
					requestId: fileuid,
					code: 0,
					status: 'pending',
				}
			});
		})
	})
});
router.get('/predict',function(req,res,next){
	// console.log('get predict list');
	let setting = {};
	getPredictList(setting,function(data){
		res.json({
			code: 0,
			message: 'get list',
			data: data
		})
	})
	
});
router.delete('/predict',function(req,res,next){
	// console.log('empty predict list');
	emptyPredict(function(data){
		res.json({
			code: 0,
			message: 'empty list',
		})
	})
})


function createMnist(param,callback){
	var mnist = new Mnist({
		predictId: param.predictId,
		uploadUrl: param.uploadUrl,
		modelId: param.modelId,
		code: 0,
		status: predictStatus[0],
	});
	mnist.save(function(err,res){
		if(err){
			console.log('insert err:',err);
			callback&&callback(err);
		}
		// console.log('insert suc:',res);
		callback&&callback(res);
	})
}
function updateMnist(param,callback){
	var origin = {
		predictId:param.predictId
	};
	// var id = param.predictId;
	var aim = {
		predictId: param.predictId,
		code: param.code,
		status: predictStatus[param.code],
		predictRes: param.predictRes,
	};
	// console.log('update to:',aim);
	Mnist.findOneAndUpdate(origin,aim,{new:true},function(err,res){
		if(err){
			console.log('update err:',err);
			callback&&callback(err);
		}
		// console.log('update suc:',res);
		callback&&callback(res);
	})
}
function getMnistList(setting,callback){
	var pageSize = setting.pageSize||10;
	var currentPage = setting.currentPage||1;
	var sort = {'createdAt':-1};
	var condition = {};
	var skipnum = (currentPage-1)*pageSize;

	Mnist.find(condition,'-_id -__v').skip(skipnum).limit(pageSize).sort(sort)
		.exec(function(err,res){
			if(err){
				console.log('get error:',err);
				callback&&callback(err);
			}
			// console.log('get suc:',res);
			callback&&callback(res);
		})
}
function emptyMnist(callback){
	Mnist.remove({},function(err,res){
		callback&&callback(res);
	})
}

function mnist_predict(req,res,type){
	//get picture uploaded
	let fileuid = uuid.v1();
	saveUploadFile(req,fileuid,null,(data)=>{
		// console.log('save',data);
		if(!data){
			res.json({
				code: -2,
				message: 'save error'
			})
			return;
		}
		if(data.code!==0){
			res.json(data);
			return;
		}

		let {fileName,fileUrl} = data;

		let suffix = [
			'/predict',
			'/predict_new'
		];
		let port='5001',host='127.0.0.1';//'192.168.153.128';
		let url = "http://"+host+':'+port+suffix[type];

		//带文件上传的使用案例,result true/false，请求成功/失败
		httpUtil.post(url, {
			'image': httpUtil.file(fileName, fileUrl),
		}, true, (result, data)=> {
			console.log('get data',{res:result,data:data.toString()})
			if(result){
				updateMnist({
					predictId: fileuid,
					code: 1,
					predictRes: JSON.parse(data.toString()).prediction,
				})
			}else{
				updateMnist({
					predictId: fileuid,
					code: 2,
				})
			}
		});

		console.log('type',type);
		let route = fileUrl.replace('\\','/').split('public').pop();//将文件目录映射到http请求url上
		let uploadUrl = 'http://'+config.host+':'+config.port+route;
		console.log('start predict: '+fileuid);
		createMnist({
			predictId:fileuid,
			uploadUrl: uploadUrl,
			modelId: type,
		},function(data){
			// console.log(data);
			res.json({
				code: 0,
				message: 'requested',
				data:{
					requestId: fileuid,
					code: 0,
					status: 'pending',
				}
			});
		})
	})
}

router.get('/mnist', function(req, res, next) {
	res.sendFile(path.resolve(__dirname,'../views/mnist.html'));
});
router.post('/mnist-predict',function(req,res,next){
	mnist_predict(req,res,0);
});
router.post('/mnist-predict/new',function(req,res,next){
	mnist_predict(req,res,1);
});
router.get('/mnist-predict',function(req,res,next){
	// console.log('get predict list');
	let setting = {};
	getMnistList(setting,function(data){
		res.json({
			code: 0,
			message: 'get list',
			data:{
				lists: data,
				type: req.query.type,
				modelPerformance: modelPerformance,
			}
		})
	})
	
});
router.delete('/mnist-predict',function(req,res,next){
	// console.log('empty predict list');
	emptyMnist(function(data){
		res.json({
			code: 0,
			message: 'empty list',
		})
	})
})


module.exports = router;
