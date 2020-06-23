const UserData = require('../DB/SignupDb');
const chatbot = require('../functions/chatbotOps');
const userCredData = require('../DB/userCredDb');
const UserCredObj = require('../functions/allObjects');
const chatData = require('../DB/chatDb');
const demoChatDB = require('../DB/demoChatDB');
const mail = require('./mail');


class DemoForm {

    static demo(req, res) {

        let email = req.body.email;
        let query = {email: email};
        console.log("Your email-id: ", email);
        const result = UserData.findOne(query, (err, user) => {
            if (user.demo_start_date !== undefined) {
                console.log('You have already taken our demo');
                return false;
            } else {
                let today = new Date();
                let date = today.getDate();
                let str = date;
                user.demo_start_date = Date();

                let start = new Date();
                let next = new Date();
                next.setDate(start.getDate() + 10);
                this.demoChatbot(req, res);
                user.demo_end_date = new Date(next);

                user.isDemo = true;
                user.save().then(res => {
                    console.log('Demo date have been saved');
                }).catch(err => {
                    console.log('There is some error in saving the demo date');
                })
            }
        });
    }


    static demoChatbot(req, res) {
        //Assigning the bot to the user after payment
        UserData.findOne({company_id: req.user.company_id}, function (err, user) {
            userCredData.findOneAndUpdate({isAssigned: false}, {isAssigned: true}, function (err, doc) {
                if (err) throw err;
                if (doc === null) {
                    console.log('Data is not found');
                } else {
                    console.log('User submitted domain', doc.project_id);
                    user.demoPId = doc.project_id;
                    user.save();
                    let demoChat = new demoChatDB({company_id:user.company_id, isActive: true});
                    demoChat.save().then(result=>{
                        console.log('Your demochats are saved');
                        mail.sendMail(req.user, 'Successfully accquired our demo','You have accquire our 15 days demo.');
                    }).catch(err=>{
                        console.log('You got some error in saving the demo chats db');
                    });
                }
            });
        });
    }
}


module.exports = DemoForm;