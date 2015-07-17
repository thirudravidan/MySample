// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
//var bcrypt = require('bcrypt-nodejs');
mongoose.set('debug', true);
// define the schema for our user model
var userSchema = mongoose.Schema({
    emailID: String,
	devices:[{
		macAdd:String,
		devType:String,
		status:Number,
		devList:[]
	}]
});

// create the model for users and expose it to our app
module.exports = mongoose.model('users', userSchema);	