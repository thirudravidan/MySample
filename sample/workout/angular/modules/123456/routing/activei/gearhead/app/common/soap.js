var soap = require('soap');
var passport = require('passport');

module.exports.ghService = function(methods, args, callBack){
	var client ={};
	var wsdlOptions = {
		strictSSL: false
	};
	soap.createClient(settings.netgearUrl, wsdlOptions, function(err, client){
		var returnResult = {};
		returnResult.err = err;
		// console.log(client.Services);
		if(client != null) {
			client[methods](args, function(err, result, raw){
				if(err){
					returnResult.err = err;
					throw err;
				}
				returnResult.result = result;
				//returnResult.raw = raw;
				callBack(returnResult);
			});
		} else {
			callBack(returnResult);
		}
	});
};

module.exports.activeiService = function(method, args, callBack){
	var client ={};
	var wsdlOptions = {
		strictSSL: false
	};
	soap.createClient(settings.activeiUrl, function(err, client){
		client[method](args, function(err, result){
			if(err){
				throw err;
			}
			res.json(result);
		});
	});
};