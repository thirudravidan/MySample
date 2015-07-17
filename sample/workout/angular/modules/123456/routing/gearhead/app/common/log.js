var log = require("sp-logger");

// Settings for Log files 
GLOBAL.logger = log.create({
    enable: ["error", "warn", "info", "debug", "stdout", "stderr"], directory:settings.logPath, fileName:settings.logName, writeDelay: 1
});

// To use in all files
console.logger = logger;

exports.errorLog = function(error) {
	switch (error.errno) {
		case "EADDRNOTAVAIL":
			console.log("Invalid IP specified in the config file.");
		break;
		case "EADDRINUSE":
			console.log("Port has already in use: "+ settings.server.port );
		break;
		default:
			console.log("Unknown Error:" + error);
	}
	console.logger.error(error);
	//server.listen(settings.server.port, settings.server.ip); 
	process.exit(code=0);
};