var mongoose = require("mongoose");
var mnistSchema = mongoose.Schema({
    predictId: { type: String, require: true, unique: true },
    status: {type:String, default: 'pending'},
    code: {type:Number, default: 0},
	predictRes: {type:String, default: ''},
	uploadUrl: {type:String, default: ''},
    createdAt: {type:String,default: new Date().toLocaleString()},
	modelId: {type:Number, default: 0},
	//{type: Date, default: Date.now },
});



var Mnist = mongoose.model('mnist',mnistSchema);
module.exports = Mnist;