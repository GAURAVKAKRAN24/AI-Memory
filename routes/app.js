var express = require('express');
var router  = express();
var mongoose = require('mongoose');
require('mongoose-type-email');
var passport = require('passport');
const bcrypt = require('bcrypt');
const bcryptjs = require('bcryptjs');
const UserData = require('../DB/SignupDb');
// const chatdatas = require('../DB/historyDb')
const { ensureAuthenticated } = require('../config/auth');
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');


//Login route-
router.post('/login', passport.authenticate('local',{
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
}),function (req, res, next) {});


//User Registration route-
router.post('/insert', function (req, res, next) {
    console.log('inside insert')

    var user = {
      name: req.body.name,
      last: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      password:req.body.password,
      resetPasswordToken: "none",
      resetPasswordExpires: Date()
    };

    user.username = user.email.split('@')[0]

    const data  = new UserData(user);

    UserData.findOne({email: req.body.email})
        .then(user => {
            if (user){
                res.redirect('/');
            }else if(req.body.verify !== req.body.password){
                res.redirect('/');
            }
            else{
                bcrypt.genSalt(10, (err, salt)=> bcrypt.hash(data.password, salt, (err, hash)=>{

                    if(err) throw err;
                    data.password = hash;

                    data.save()
                        .then(user =>{
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/');
                        })
                        .catch(err => console.log(err));
                }));
            }
        })
});


//Log-out handle-
router.get('/logout', (req, res)=>{
    req.logout();
    //req.flash('success_msg','You are log-out');
    res.redirect('/');
});


//forgot password-
router.get('/forgot-pass-form', (req, res)=>{
    res.render('forgotpass');
});


// rout for forget password 
router.post('/forgot-pass', (req, res, next)=>{
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err,token);
            });
        },
        function (token, done) {
            UserData.findOne({email: req.body.email}, function (err, user) {
                if(!user){
                    return res.redirect('/');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;
                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
               service:'Gmail',
               auth:{
                   user: 'vr54640@gmail.com',
                   pass: ''
               }
            });
            var mailoption = {
                to: req.body.email,
                from: 'vr54640@gmail.com',
                subject:'Password reset mail',
                text: 'http://'+req.headers.host+'/reset'
            };
            smtpTransport.sendMail(mailoption, function (err) {
                console.log('mail-sent');
                done(err,'done');
            });
        }
    ],function (err) {
        if(err) throw err;
        res.redirect('/forgot-pass-form');
    });
   console.log(req.body.email);
});


// route to reset passwords
router.get('/reset', function (req, res) {

    res.render('resetPassword');
});


// route to render main home page
router.get('/', function(req, res){

    res.render('index')

});

// rout to show user portal
router.get('/profile', ensureAuthenticated, function(req, res){
    
    doc = {name: "Aakash"}
    res.render('profile', {user_data: req.user});    
});


// route to show dashboard
router.get('/dashboard/', ensureAuthenticated, function(req, res){
    console.log(req.user);
    res.render('dash', {user_data: req.user});
});


// route to show notifications
router.get('/notifications', ensureAuthenticated, function(req, res){

    res.render('notifications', {user_data: req.user})
});


// route to show history
router.get('/history', ensureAuthenticated, function(req, res){
    res.render('history', {user_data: req.user})
});


// route to show docs page
router.get('/docs', function(req, res){
    res.sendStatus(404)
});


// route to show support page
router.get('/support', function(req, res){
    
    res.render('support', {user_data: req.user})
});


module.exports = router;
