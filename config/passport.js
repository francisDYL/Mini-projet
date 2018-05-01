const LocalStrategy = require('passport-local').Strategy;
const config = require('../config/database');
const path=require('path');
const bcrypt = require('bcryptjs');
var citizen = require('../models/citizen');
var serviceProvider =require('../models/serviceProvider');
var admin =require('../models/admin');
var type;

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy({
    passReqToCallback: true,
    session: true
  },function(req,username, password, done){
    // Match Username
    let query = {username:username};
    type=req.session.UsrType;
    if(req.session.UsrType){
     
      var User =require(path.join('../models/',req.session.UsrType));  
      User.findOne(query, function(err, user){
        if(err) throw err;
        if(!user){
          return done(null, false, {message: 'No user found'});
        }
        bcrypt.compare(password, user.password, function(err, isMatch){
          if(err) throw err;
          if(isMatch){
            return done(null, user);
          } else {
            return done(null, false, {message: 'Wrong password'});
          }
        });
      });
           
    }
    else{
      return done(null, false, {message: 'preciser .....'});
    }

  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    var User =require(path.join('../models/',req.session.UsrType));  
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
