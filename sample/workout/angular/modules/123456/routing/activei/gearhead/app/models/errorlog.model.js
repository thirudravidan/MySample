// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
//var bcrypt = require('bcrypt-nodejs');
mongoose.set('debug', true);
// define the schema for our user model
var errorLogSchema = mongoose.Schema({
    custID: String,
    OS: String,
    errorCode: String,
    errorType: String,
    errorMsg: String,
    errorDetails: String,
    errorLocation: String,
    errorDate : { type: Date, default: Date.now },
});

// create the model for error log and expose it to our app
module.exports = mongoose.model('errorlog', errorLogSchema);	