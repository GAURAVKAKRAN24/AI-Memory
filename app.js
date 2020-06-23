var express = require('express');
var router  = express();
var mongoose = require('mongoose');
//require('mongoose-type-email');
var passport = require('passport');
const bcrypt = require('bcrypt');
const bcryptjs = require('bcryptjs');

const ourBotCreds = require('./DB/ourBotCreds');


//Database call-
const UserData = require('./DB/SignupDb');
const userCredData = require('./DB/userCredDb');
const chatData = require('./DB/chatDb');
const demoChat = require('./DB/demoChatDB');


const cook = require('cookie-parser');
const { ensureAuthenticated } = require('./config/auth');
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');
//Paytm params call
const https = require('https');
const checksum_lib = require('./config/checksum');
const paytmParams = require('./payment/payment');

//Call chatbot
const bot = require('./config/chatBot');


const chatbotClass = require('./functions/chatbotOps');



//Testing the chats data here
const getChatData = require('./functions/getChats');
router.get('/chats', function (req, res, next) {
    getChatData.chats(req, res);
});




const dateDemo = require('./functions/demoForm');
//demoForm
router.get('/demoForm', (req, res, next)=>{
    if(req.user == undefined){
        req.flash('message', 'You have to log-in first');
        res.redirect('/');
        console.log('Please log-in first');
    }
    res.render('demo_form');
});

router.post('/data', function (req, res, next) {
   UserData.find({demo_start_date: {$exists: true}}, function (err, user) {

        res.json({
           user: user
        });
        //res.send(user);
        //console.log('user query results-', user);
    });

});


router.post('/demoForm', function (req, res, next){

        if(req.user.demo_start_date !== undefined){
            req.flash('message', 'You have already buy our demo');
            console.log('You already have our demo');
            res.redirect('/');
        }else{
            dateDemo.demo(req, res);

            req.flash('message', 'You have successfully buy our demo');
            res.redirect('/');
        }
        console.log(req.user.demo_start_date);


});

//route for buying the chatbot
const ourchatbot = require('./functions/ourChatBot');

router.get('/ourBotChat', function (req, res, next) {
    res.render('chatbot');
});



router.post('/ourBotChat', function(req, res ,next){
    console.log('reply route called');
    ourchatbot.reply(req, res);
});


router.get('/buy',function (req, res, next) {
    if(req.user == undefined){
        req.flash('message', 'Please log-in first');
        res.redirect('/');
    }else {

        res.render('buy', {quantity: req.query.quantity, price: req.query.price});
    }
});


router.post('/buyBotSubmit', ensureAuthenticated,function (req, res, next) {
    console.log('buyBotSubmit route called');
    chatbotClass.buyChatbot(req, res);
    res.redirect('/');
});





//route for inserting the jsonCred file in database-
router.get('/file',function (req, res, next) {

    res.render('credFile');
});

router.post('/file',function (req, res, next) {
    const data = new userCredData(req.body);
    data.save()
        .then(item=>{
            res.send('Your user Cred data has been saved');
        }).catch(err=>{
        res.status(400).send("Unable to save the data");
    });
});

//Login route-
router.get('/login', function (req, res, next) {

    res.render('login_form',{message:req.flash('error')});
});


router.get('/category', function (req, res, next) {
    res.render('chatbot_category');
});



router.get('/bot', function (req, res, next) {


    chatbotClass.renderChatbot(req, res);
    console.log('CID', req.query.Cid, " ", "Pid", req.query.Pid);
    res.render('clientChatBot', {company_id:req.query.Cid, project_id:req.query.Pid});
});


router.post('/checkDemo', (req, res, next)=>{

    UserData.findOne({company_id:req.body.company_id}, function (err, user) {
        if(user.isDemo){
            chatbotClass.isDemoOver(req, res).then((result) => {
                if (result.cond) {

                    console.log("Your demo is over");
                } else {
                    console.log("You demo is not over");
                }
            });
        }
    });



});


router.post('/bot' ,(req, res, next)=> {
    console.log(req.body.company_id, "PID", req.body.project_id);
    UserData.findOne({company_id:req.body.company_id}, function (err, user) {
        if(!user){
            console.log("User is not present");
        }else{
            if(user.isBuy){
                chatbotClass.chatbotResponse(req,res, user);
            }else if(user.isDemo){
                chatbotClass.chatbotResponse(req, res, user);
            }
        }
    });
});
//Chatbot route ends



const register = require('./functions/register');

//User Registration route-
router.get('/insert', function (req, res, next) {
    res.render("signup_form", {message: req.flash('message')});
});
router.post('/insert', function (req, res, next) {
    register(req, res);
});


//Log-out handle-
router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
});



//forgot password-
router.get('/forgot-pass-form', (req, res)=>{
    res.render('forgotpass');
});


//Whatsapp Route 
router.get('/whatsappPage', (req, res)=>{
    res.render('whatsappPage');
});


const passwordAuthOps = require('./functions/passwordAuthOps');
router.post('/forgot-pass', (req, res, next)=>{
   passwordAuthOps.forgotPassword(req, res);
   console.log(req.body.email);
});

router.get('/reset/:token', function (req, res) {

    UserData.findOne({resetPasswordToken: req.params.token}, function (err, user) {
        if(!user){
            return res.redirect('/forgot-pass-form');
        }
        res.render('resetPassword', {token: req.params.token});
    });
});



router.post('/reset/:token', function(req, res){
    passwordAuthOps.reset(req, res);
});



const autoLogin = require('./functions/autoLogin');
router.get('/',  function(req, res){
    console.log('You cookie -', req.cookies['cookie']);
    res.render('index', {message: req.flash('message')});
});


router.get('/profile', ensureAuthenticated, function(req, res){
    console.log(req.user);


    let data = [];
    if(req.user.isBuy){
        console.log('Working buy method', req.user.project_id.length);

        for(let i=0;i<req.user.project_id.length;i++){
            console.log(req.user.project_id[i]);
            data.push(req.user.project_id[i]);
        }
    }else if(req.user.isDemo){
        data.push(req.user.demoPId);
    }

    res.render('profile', {message: req.flash('message'), user_data: req.user, iframeData:data});
});

router.use('/dashboard', ensureAuthenticated, require('./routes/dashboardRoute.js'))


// route to show dashboard
router.get('/dashboard/', ensureAuthenticated, function(req, res){
    console.log(req.user);
    res.render('dash', {user_data: req.user});
});

// route to show notifications
router.get('/notifications', ensureAuthenticated, function(req, res){

    res.render('notifications', {user_data: req.user})
});



router.use('/history', ensureAuthenticated, require('./routes/historyRoute.js'))

// route to show history
router.get('/history', ensureAuthenticated, function(req, res){
    res.render('history', {user_data: req.user})
});

router.get('/docs', function(req, res){
    res.sendStatus(404)
});

// route to show support page
router.get('/support', function(req, res){ 
    res.render('support', {user_data: req.user})
});


const sendProblem = require('./functions/sendProblems');
router.post('/sendMessage', function (req, res, next) {
    sendProblem.problem(req.body.message, req.body.email, req.body.subject);
    req.flash('message', 'Your Problem has been send to the admins');
    res.redirect('/');
});


//route to update user profile-
const updateProfile = require("./functions/updateProfile");

router.post('/updateProfile', function (req, res, next) {
    if(req.body.email !== ""){
        console.log("email", req.body.email);

    }else{
        console.log("Not null");
    }
    updateProfile.updateProfile(req,res);
    req.flash('message', 'You have successfully updated your information');
    res.redirect("/profile");
});


router.post('/login', passport.authenticate('local',{
    //  successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}),function (req, res, next) {

    if(req.user){
        req.flash('message', 'You are successfully log-in');
    }
    res.redirect('/profile');

});


router.get('/auth/google/token', passport.authenticate('google-token'), (req, res)=>{
   res.send(req.user);
});

router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] ,
        access_token:'ya29.a0AfH6SMBB9A7Gto4pMOtoHbCelNEb7QwpczVNF7l684Zy-f-Mv1v0o0phIExJ0WKPyTXN4kr8RJgoW-gkA2phWNJtoVub-B5lng3WWUME9XfOnmUafhl7cClOx3pXJf2iPrYfNYGo3J7hBn8EJ0ODpDBfohFc1tRAxEQ'}));

router.get('/auth/google/secret',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.send(req.user);
        console.log('gmailInfo',req);
    });


module.exports = router;
