var service = require('../../common/soap');
// Home:--->
exports.GetUnreadMessageCount = function(req, res) {
	var web = service.callService(req.params.method, req.body, res);
};

exports.CustomerLogin = function(req, res) {
	var web = service.callService(req.params.method, req.body, res);
};

exports.GetContractsAvailabilitybyCustomerId = function(req, res) {
	var web = service.callService(req.params.method, req.body, res);
};

exports.MyScheduleCases = function(req, res) {
	var web = service.callService(req.params.method, req.body, res);
};

exports.CustomerGetProductInfo = function(req, res) {
	var web = service.callService(req.params.method, req.body, res);
};

exports.CreateCase = function(req, res) {
	var web = service.callService(req.params.method, req.body, res);
};


// Web Ticket:--->

exports.CustomerGetCases = function(req, res) {
	var web = service.callService(req.params.method, req.body, res);
};

// KnowledgeBase:--->

exports.GetContent = function(req, res) {
	var web = service.callService(req.params.method, req.body, res);
};

// Message Center:--->

exports.GetmessageDetails = function(req, res) {
	var web = service.callService(req.params.method, req.body, res);
};

exports.GetmessageviewDetails = function(req, res) {
	var web = service.callService(req.params.method, req.body, res);
};

// My Profile:--->

exports.CustomerSearch = function(req, res) {
	var web = service.callService(req.params.method, req.body, res);
};

exports.CustomerGetProduct = function(req, res) {
	var web = service.callService(req.params.method, req.body, res);
};

exports.CustomerChangePassword = function(req, res) {
	var web = service.callService(req.params.method, req.body, res);
};
