// Iot Server Initialize
//var net = require('net');
//var jsonSocket = require('json-socket');

module.exports = function(app) {
	var server = require('http').createServer(app);
	var socketIo = require('socket.io');
	var io = socketIo.listen(server);
	var usrCtrl = require('./socket.controller');

	var port = process.env.PORT || settings.server.port;

	/*io.sockets.on('connection', function (socket) {
		console.log("Got New Connection");
		socket.on("disconnect", function(){

		});

		socket.on('client', function (data, callback) {
			sockets.clientConnect(socket, data, function(response) {
				callback(response);
			});
		});

		socket.on('addDevice', function(data, callback) {
			sockets.addDevice(socket, data);
		});
	});*/

	server.listen(port, settings.server.ip, function () {
	    console.log('Im listening on http://'+settings.server.ip+':'+port);
	});
};