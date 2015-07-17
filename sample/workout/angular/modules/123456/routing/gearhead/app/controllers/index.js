module.exports.methodCall = function(req, res){
	//Based on the param import that controller
	var genericController = new Object;
	switch(req.params.action) {
		case 'gearhead':
			genericController = require('./gearhead/gearhead.controller');
			break;
		case 'activei':
			genericController = require('./activei/activei.controller');
			break;
		case 'network':
			genericController = require('./networkmap/db.controller');
			break;
		case 'error':
			genericController = require('./errorlog/errorlog.controller');
			break;
		default:
			break
	}
	if(genericController.hasOwnProperty(req.params.method)) {
		//if(req.params.method === "CustomerLogin") {
			genericController[req.params.method](req, res);
		//} else {
			//genericController[req.params.method](req, res);
		//}
	} else {
		res.json("Invalid Request");
	}

}