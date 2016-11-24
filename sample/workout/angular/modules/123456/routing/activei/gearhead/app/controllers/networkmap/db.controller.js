var usrCtrl = require('../../models/user.model');

exports.addDevice = function(req, res) {
    var data = req.body;
    var user = new usrCtrl();
    var returnRes = {};
    usrCtrl.findOne({ $and: [{'emailID' : data.username},{devices: {"$elemMatch": {macAdd: data.macAdd}}}]}, function(err, user){
        if(err) {
            returnRes.err = err;
        } else {
            if (user){
                returnRes.deviceStatus = 0;
                    user._id = user._id;
                    console.log(user.devices);
                    user.devices.forEach(function (value, key){
                        console.log(value);
                        if(value.macAdd === data.macAdd) {
                            user.devices[key]._id = user.devices[key]._id;
                            if(data.devList != '') {
                                device.devList = [];
                                device.devList[0] = JSON.parse(data.devList);
                            }
                         }
                    });
                    console.log(user);
                    user.save();
                returnRes.success = user;
            } else {
                usrCtrl.findOne({'emailID' : data.username}, function(err, user){
                    if(err) {
                        returnRes.err = err;
                    } else {
                        if (user){
                            returnRes.deviceStatus = 1;
                            var device = {};
                            device.macAdd = data.macAdd;
                            device.devType = data.devType;
                            if(data.devList != '') {
                                device.devList = [];
                                device.devList[0] = JSON.parse(data.devList);
                            }
                            user._id = user._id;
                            user.devices.push(device);
                            user.save();
                        } else {
                            returnRes.deviceStatus = 1;
                            var user = new usrCtrl();
                            user.emailID = data.username;
                            var device = {};
                            device.macAdd = data.macAdd;
                            device.devType = data.devType;
                            if(data.devList != '') {
                                device.devList = [];
                                device.devList[0] = JSON.parse(data.devList);
                            }
                            user.devices.push(device);
                            user.save();
                        }
                        returnRes.success = user;
                    }
                });
            }
        }
        res.json(returnRes);
    })
};

exports.getDevice = function(req, res) {
	var data = req.body;
    var returnRes = {};
	usrCtrl.findOne({'emailID' : data.username}, function(err, user) {
        if(err) {
            returnRes.err = err;
        } else {
            if(user) {
                returnRes.success = user;
            } else {
                returnRes.success = null;
            }
        }
        res.json(returnRes);
    });
}

exports.getLogDevice = function(req, res) {
    var data = req.body;
    var returnRes = {};
    usrCtrl.findOne({ $and: [{'emailID' : data.username},{devices: {"$elemMatch": {macAdd: data.macAdd}}}]}, function(err, userUpdate) {
        if(err)
            returnRes.err = err;
        else {
            if(userUpdate) {
                userUpdate.devices.forEach(function (value, key){
                    if(value.macAdd === data.macAdd) {
                        userUpdate.devices[key]._id = userUpdate.devices[key]._id;
                        if(data.status === 1)
                            userUpdate.status = 'Active';
                        else 
                            userUpdate.status = 'InActive';
                     }
                });
                userUpdate.save();
                returnRes.success = userUpdate;
            } else {
                returnRes.success = null;
            }
        }
    });
    res.json(returnRes);
}

exports.removeDevice = function(req, res) {
    var data = req.body;
    var returnRes = {};
    usrCtrl.findOne({ $and: [{'emailID' : data.username},{devices: {"$elemMatch": {macAdd: data.macAdd}}}]}, function(err, user) {
        if(err) {
            returnRes.err = err;
        } else {
            if (user){
                returnRes.deviceStatus = 1;
                user._id = user._id;
                user.devices.forEach(function (value, key){
                    if(value.macAdd === data.macAdd) {
                        user.devices.splice(key, 1);
                     }
                });
                user.save();
                returnRes.success = user;
            } else {
                returnRes.deviceStatus = 2;
            }
        }
        res.json(returnRes);
    });
}