const mongoose = require('mongoose');
var  GoogleStrategy = require('passport-google-oauth20').Strategy;
var credentials = require('./keys');

//Load user model
let User = require('../DB/SignupDb');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
            clientID: credentials.GoogleClientID,
            clientSecret: credentials.GoogleClientSecrets,
            callbackURL: "http://localhost:8080/auth/google/secret",
            userProfileURL:"https://www.googleapis.com/oauth2/v2/userinfo"
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(accessToken);
            User.findOne({email: profile.id}, (err, user)=>{
                if(!user){
                   /* console.log(profile.emails[0].value);
                    user.username = profile.displayName;
                    user.name = profile.name.familyName;
                    user.last = profile.name.givenName;
                    user.email = profile.emails[0].value;*/
                    console.log(profile);



                }
            })

           /* User.findOrCreate({googleId: profile.id}, function (err, user) {
                return cb(err, user);
            });*/
        }
    ));
};