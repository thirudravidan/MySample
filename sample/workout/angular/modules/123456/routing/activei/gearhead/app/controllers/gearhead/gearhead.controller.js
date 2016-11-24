var service = require('../../common/soap');

// Home:--->
exports.CustomerLogin = function(req, res) {
	var postData = req.body;
	var args = {	 
		apikey: settings.apikey,	
		email  : postData.email, //'ghconnect_test1@example.com',
		password : postData.password //'Pass@23'
	};
	callSoapService(req.params.method, args, function(response, err){
		if(response.err == null) {
			if(response.result.hasOwnProperty('CustomerLoginResult')) {
				var customerDetail = response.result.CustomerLoginResult;
				if(customerDetail.SessionID) {
					var params = {
						apikey: settings.apikey,
						CustomerID : customerDetail.CustomerID,
						email : args.email,
						phoneNo : '',
						isoCountry: '',
						companyName : '',
						exactPhone : '' 
					}
					CustomerSearch('CustomerSearch', params, function(response){
						if(response.err == null) {
							if(response.result.hasOwnProperty('CustomerInfo')) {
								var CustomerInfo = response.result.CustomerInfo;
								if(CustomerInfo.hasOwnProperty('Customer')) {
									var result = {
										CustomerId : CustomerInfo.Customer.Customer_ID,
										CustomerEmail : args.email,
										SessionId : customerDetail.SessionID,
										PortalId : customerDetail.PortalID,
										Country : CustomerInfo.Customer.Country,
										FirstName : CustomerInfo.Customer.First_Name,
										LastName : CustomerInfo.Customer.Last_Name,
									}
									res.json(result);
								} else {
									res.json({err:"No Records Found"});
								}
							}
						}
					});
				}
			}
		} else {
			res.json(response.err);
		}
	});
};

exports.EcoLogout = function(req, res) {
	var postData = req.body;
	var args = {	
		apikey: settings.apikey,	
		sessionId  : postData.sessionId
	};
	callSoapService(req.params.method, args, function(response, err){
		if(response.err == null) {
			res.json(response.result);
		} else {
			res.json(response.err);
		}
	});
};

exports.GetContractsbyCustomerId = function(req, res) {
	var postData = req.body;
	var args = {	
		apikey: settings.apikey,	
		customer_id:postData.customerId //22933063
	};
	callSoapService('CustomerGetContracts', args, function(response, err){
		if(response.err == null) {
			res.json(response.result);
		} else {
			res.json(response.err);
		}
	});
};

exports.CustomerForgetPasswordRecovery = function(req, res) {
	var postData = req.body;
	var args = {	
		apikey: settings.apikey,
		email  : postData.email
	};
	callSoapService(req.params.method, args, function(response, err){
		if(response.err == null) {
			res.json(response.result);
		} else {
			res.json(response.err);
		}
	});
};

exports.CustomerChangePassword = function(req, res) {
	var postData = req.body;
	var args = {	
		apikey: settings.apikey,
		customerId  : postData.customerId,
		Email : postData.Email,
		NewPassword : postData.NewPassword
	};
	callSoapService(req.params.method, args, function(response, err){
		if(response.err == null) {
			res.json(response.result);
		} else {
			res.json(response.err);
		}
	});
};

exports.CustomerCreate = function(req, res) {
	var postData = req.body;
	var args = {	
		apikey: settings.apikey,
		'':'Consumer',
		'':'',
		firstName  : postData.firstName,
		lastName : postData.lastName,
		phoneNo : postData.phoneNo,
		email : postData.email,
		city : postData.city,
		state : postData.state,
		postCode : postData.postCode,
		country : postData.country,
		mailProgram : postData.mailProgram,
		mailPassword : postData.mailPassword,
		userPassword : postData.userPassword,
		betaProgram : postData.betaProgram
	};
	callSoapService(req.params.method, args, function(response, err){
		if(response.err == null) {
			res.json(response.result);
		} else {
			res.json(response.err);
		}
	});
};

exports.CreateCase = function(req, res) {
	var postData = req.body;
	var args = {	
		apikey: settings.apikey,	
		customerId  : postData.customerId,
		registrationId : postData.registrationId,
		serialNumber : postData.serialNumber,
		caseSummary : postData.caseSummary,
		caseProblem : postData.caseProblem,
		caseCauses : postData.caseCauses,
		caseNotes : postData.caseNotes,
		caseSource : postData.caseSource,
		caseAssingTo : postData.caseAssingTo,
		caseQueueId : postData.caseQueueId
	};
	callSoapService(req.params.method, args, function(response, err){
		if(response.err == null) {
			res.json(response.result);
		} else {
			res.json(response.err);
		}
	});
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
	var postData = req.body;
	var params = {
		apikey: settings.apikey,
		CustomerID : postData.customerID,
		email : postData.email,
		phoneNo : '',
		isoCountry: '',
		companyName : '',
		exactPhone : '' 
	};
	CustomerSearch('CustomerSearch', params, function(response){
		res.json(response.result);
	});
};

exports.CustomerGetProduct = function(req, res) {
	var web = service.callService(req.params.method, req.body, res);
};

exports.CustomerChangePassword = function(req, res) {
	var web = service.callService(req.params.method, req.body, res);
};

// Internal Common Call Function
var CustomerSearch = function(method, params, callBack) {
	callSoapService(method, params, function(response){
		var returnResult = {};
		returnResult.err = response.err;
		if(response.err == null) {
			if(response.result.hasOwnProperty('CustomerSearchResult')) {
				var customerResult = response.result.CustomerSearchResult;
				returnResult.result = customerResult;
				callBack(returnResult)
			}
		} else {
			callBack(returnResult);
		}
	});	
};

var callSoapService = function(method, params, callBack) {
	service.ghService(method, params, function(response){
		callBack(response);
	});
};