var usrCtrl = require('./db.controller');

exports.clientConntect = function(socket, data, callBack){
	clients[data.username].push(data);
	usrCtrl.getDevice(data, function(response) {

	});
}

exports.addDevice = function(socket, data){
	usrCtrl.addDevice(data);
}