var BasicStrategy = require('passport-http').BasicStrategy
  , AnonymousStrategy = require('passport-anonymous').Strategy;

var die = function(msg){
    console.log(msg)
    process.exit(1);
} 

module.exports = function(passport){
    passport.use(new BasicStrategy({
      },
      function(username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
          findByUsername(username, soapEmail, function(err, user) {
            console.log(user);
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
          })
        });
      }
    ));

    passport.use(new AnonymousStrategy());

    var findByUsername = function (username, soapEmail, fn) {
        if (username === soapEmail) {
          return fn(null, soapEmail);
        }
        return fn(null, null);
    }    
}

