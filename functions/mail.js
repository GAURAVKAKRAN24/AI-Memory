const nodemailer = require('nodemailer');



function sendMail(user, subject, text) {
    let smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'vr54640@gmail.com',
            pass: '8899017147A'
        }
    });
    let mailoption = {
        to: user,
        from: 'vr54640@gmail.com',
        subject: 'Password reset mail',
        text:   text
    };
    smtpTransport.sendMail(mailoption, function (err) {
        console.log('mail-sent');
    });
}

module.exports = {sendMail:sendMail};