/**
 * Module dependencies.
 */

// Sathik: Have index.js and invoke tenant controller

var passport = require('passport');
// Gear Head Routings
module.exports = function(app) {
	// User Routes
	var index = require('../controllers/index');
	// Setting up the users profile api
	app.route('/webService/:action/:method').get(index.methodCall);
	app.route('/webService/:action/:method').post(index.methodCall);
	
};