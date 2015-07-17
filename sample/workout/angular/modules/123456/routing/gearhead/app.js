var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var expressSession = require('express-session');
var http = require('http');
var https = require('https');
var mongoose = require('mongoose');
var config = require('./config');
https.globalAgent.options.secureProtocol = 'SSLv3_method';

GLOBAL.settings = config.settings();

mongoose.connect(settings.mongodb);

//R: Load from config file
var port = process.env.PORT || settings.server.port; 
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
 	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});
// Configuring Passport
//R: Load the secrect key from the file and mentioned the file in config
app.use(expressSession({secret: 'mySecretKey', saveUninitialized: true, resave: true}));
//app.use(passport.initialize());
//app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
 //R: If we are not using remove flash. Do we really need this?
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
//var initPassport = require('./app/passport/init');
//initPassport(passport);

//config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
//	require(path.resolve(routePath))(app);
//});

//Sathik: This has to be based on the key, we need to identify the tenant and invoke those route
require(path.resolve('./app/routes/routes'))(app)
//network mapping
require(path.resolve('./app/controllers/networkmap/networkmap.controller'))(app)

/*app.listen(port, function(){
	console.log('Im listening on http://10.20.28.25:'+port);
})*/

// Error Handler
process.on('uncaughtException', function(err) {
  console.log("Uncaught Error Stack:"+ err.stack);
  console.log("Uncaught Error Message:"+ err.message);
});
module.exports = app;

