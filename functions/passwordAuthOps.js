const nodemailer = require('nodemailer');
const crypto  = require('crypto');
const UserData = require('../DB/SignupDb');
const async = require('async');
const bcrypt = require('bcrypt');

class PasswordAuth {

    static forgotPassword(req, res) {

        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    let token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                UserData.findOne({email: req.body.email}, function (err, user) {
                    if (!user) {
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
                let smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'vr54640@gmail.com',
                        pass: '8899017147A'
                    }
                });
                let mailoption = {
                    to: user.email,
                    from: 'vr54640@gmail.com',
                    subject: 'Password reset mail',
                    text: 'http://' + req.headers.host + '/reset/' + token
                };
                smtpTransport.sendMail(mailoption, function (err) {
                    console.log('mail-sent');
                    done(err, 'done');
                });
            }
        ], function (err) {
            if (err) throw err;
            res.redirect('/forgot-pass-form');
        });

    }


    static reset(req, res) {
        console.log('User params token: ', req.params.token);

        async.waterfall([

            function (done) {
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(req.body.password, salt, function (err, hash) {
                    let update = {password: hash};
                    let filter = {resetPasswordToken: req.params.token};
                    UserData.findOneAndUpdate(filter, update, function (err, user) {
                        if (err) throw err;
                        console.log('Your password has been updated');
                        req.login(user, function (err) {
                            if (err) throw err;
                            console.log('You are log-in now');
                            done(err, user);
                        })
                    })
                }))
            }, function (user, done) {
                let smtpTransport = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'vr54640@gmail.com',
                        pass: '8899017147A'
                    }
                });
                let mailOptions = {
                    to: user.email,
                    from: 'vr54640@gmail.com',
                    subject: 'Your password has been changed',
                    text: 'This is a configuration that the password for your account' + user.email + 'has just been changed.'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    done(err);
                });
            }

        ], function (err, result) {
            if (err) throw err;
            console.log('You have Successfully reset the password');
            req.flash('message','Your password now has been reset..');
            res.redirect('/');
        });
    }
}

module.exports = PasswordAuth;