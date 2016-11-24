var request = require('request');
var dashData = {};
var session = '';
var url = "";

module.exports.isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()){
		session = req.session;
		session.user = req.user;
		dashData.user = JSON.stringify(req.user);
		//dashData.macroTxt = JSON.stringify(session.macroTxt);
		return next();
	}
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
};

module.exports.restrict = function(req, res, next){
};

module.exports.loggedIn = function(req, res, next) {
	var userSess = req.session;
	if(userSess.hasOwnProperty('user')) {
		res.redirect('/dashboard#/dashboard');
	} else {
		next();
	}
};
