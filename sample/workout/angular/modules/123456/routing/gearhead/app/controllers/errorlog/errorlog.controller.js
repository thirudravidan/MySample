var service = require('../../common/soap');
var errlogCtrl = require('../../models/errorlog.model');
var moment = require('../../common/moment');
// Home:--->


//Get all errors
exports.getErrorLog = function (callbk) {
    errlogCtrl.find(callbk);
}


exports.errorList = function(req, res) {
    var returnRes = {};
    var postData = req.body;
    var cond={};

    var postData = req.body;
	var stdate = "";
	var endDate = "";
	var custid = "";

	if((postData.dateRange && postData.dateRange != "")) {
		var sdate = postData.dateRange.split('-')[0];
		var edate = postData.dateRange.split('-')[1];
		console.log(sdate+' = '+edate);
		if(sdate != "" && edate == "") {
			edate = postData.stDate;	
		} else if(sdate == "" && edate != "") {
			sdate = edate;
		}
		var stdate = moment(sdate).hours(0).minutes(0).seconds(0);
		var endDate = moment(edate).hours(0).minutes(0).seconds(0).add(1, 'days');
		stdate = stdate.toDate();
		endDate = endDate.toDate();
	} else {
		var stdate = moment().hours(0).minutes(0).seconds(0);
		var endDate = moment().hours(0).minutes(0).seconds(0).add(1, 'days');
		stdate = stdate.toDate();
		endDate = endDate.toDate();
	}

console.log('test');
    if(custid != "" && stdate != "") {
        cond = { custID :custid, errorDate: { $gt: new Date(stdate), $lt: new Date(endDate) }};
    } else if(custid == "" && stdate != "") {
        cond = {errorDate: { $gt: new Date(stdate), $lt: new Date(endDate) }};
    } else if(custid != "" && stdate == "") {
         cond = { custID :custid};
    } else {
       cond = {};
    }

	errlogCtrl.find(cond, function(err, eLog) {
        returnRes.err = err;
        returnRes.success = eLog;
        res.json(returnRes);
    });
}

exports.getErrorLogByCustomer = function(req, res) {
	var data = req.body;
    var returnRes = {};
	errlogCtrl.findOne({'custID' : data.username}, function(err, user) {
        returnRes.err = err;
        returnRes.success = user;
        res.json(returnRes);
    });
}

exports.insertErrlog = function (req, res, callbk) {
	console.log('Error Occured');
    var postData = req.body; 
    
    //To-DO : html ecncode and validate the values
    var errlogInfo = new errlogCtrl();
    //Inserting error log Info
    if(postData.message !="") {
	    postData.custID = '101';
	    postData.OS = 'Win32';
	    postData.errorCode = '1001';
	    postData.location = 'Server';
	    //postData.message = "This is a test error message";
		//postData.stack = "This is a test error stack details";
		console.log(req);
		errlogInfo.custID = postData.custID;
		errlogInfo.OS = postData.OS;
		errlogInfo.errorCode = postData.errorCode;
		errlogInfo.errorType = "Error";
		errlogInfo.errorMsg = postData.message;
		errlogInfo.errorDetails = postData.stack;
		errlogInfo.errorLocation = postData.location;
		errlogInfo.errorDate = new Date();

		errlogInfo.save(callbk);
	}
}

