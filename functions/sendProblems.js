const nodemailer = require('nodemailer');

function sendProblem(message, mailId, subject) {
    let smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'vr54640@gmail.com',
            pass: '8899017147A'
        }
    });
    let mailoption = {
        to: mailId,
        from: "vr54640@gmail.com",
        subject: subject,
        text: "UserID: "+ mailId + "\n" + message
    };
    smtpTransport.sendMail(mailoption, function (err) {
        console.log('mail-sent');
        done(err, 'done');
    });
}

module.exports = {
  problem: sendProblem,
};