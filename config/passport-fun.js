const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var  GoogleStrategy = require('passport-google-oauth20').Strategy;
var credentials = require('./keys');

//Load user model
let User = require('../DB/SignupDb');


//Passport authentication

module.exports = function (passport) {

    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
        // Match User
        User.findOne({email: email}, function (err, user) {
            if(!user){
                console.log("User not registered");
                return done(null, false, {message: "User not registered."});
            }
            //Match Password
            console.log(password);
            console.log(user.password);
            bcrypt.compare(password,user.password, (err, isMatch)=>{
                if(err) throw err;
                console.log(isMatch);
                if(isMatch){
                    console.log('Password matched');
                    return done(null, user, {'message':"You are successfully Log-in"});
                }else{
                    console.log("Password doesn't matched");

                    return done(null, false, {'message':"Password doesn't matched."});
                }
            });
        })
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {

        User.findById(id, function(err, user) {
            done(err, user);
        });
        console.log('My user id', id);

    });
    console.log('passport called');



};

