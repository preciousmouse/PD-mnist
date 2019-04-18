var mongoose = require("mongoose");
var predictSchema = mongoose.Schema({
    predictId: { type: String, require: true, unique: true },
    status: {type:String, default: 'pending'},
	code: {type:Number, default: 0},
	uploadUrl:{type:String, default: ''},
	predictUrl: {type:String, default: ''},
	negTumorsCount: {type:String, default: ''},
	posTumorsCount: {type:String, default: ''},
    createdAt: {type:String,default: new Date().toLocaleString()},
    //{type: Date, default: Date.now },
});

// predictSchema.methods.set = function(key,value,callback){

// }


var Predict = mongoose.model('predict',predictSchema);
module.exports = Predict;