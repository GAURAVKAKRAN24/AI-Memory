const bot = require('../config/chatBot');
const ourBotDb = require('../DB/ourBotCreds');
const ourChatBotChats = require('../DB/ourChatBotChats');
const creds = require('../DB/userCredDb');

function replyChats(req, res){
    console.log('reply function has been called');
    let find = {project_id: "test-adkunn"};
    creds.findOne({project_id: "sampleproject-vlqnbf"}, (err, user)=>{
        if(err){
                console.log("There is some error in ourBotDb");
        }
        if(!user){
            console.log('User not found');
        }else{
            console.log("User exist", user.project_id);
            bot.f2(user.project_id, req.body.text, user).then((answerChat)=>{

                    ourChatBotChats.findOne({client_id:req.body.cookie}, function (err, doc) {

                        let chatDB = {
                            ques:req.body.text,
                            ans:answerChat.fulfillmentText,
                            date: new Date(),
                            intent:answerChat.intent.displayName
                        };

                        if(!doc){

                            let HeadSchema = {
                                client_id:req.body.cookie,
                                chats:chatDB
                            };


                            let chatsStore = new ourChatBotChats(HeadSchema);
                            chatsStore.save().then(result=>{
                                console.log('New User Has been saved at ourWebBot');
                            }).catch(err=>{
                                console.log('There is some error in saving ourWebBot chats');
                            })
                        }else{

                            doc.chats.push(chatDB);
                            doc.save().then(result=>{
                                console.log('New User Has been saved at ourWebBot');
                            }).catch(err=>{
                                console.log('There is some error in saving ourWebBot chats');
                            })
                        }

                    });

                    res.json({
                        answer: answerChat.fulfillmentText
                    });
            });
        }

    });
}

module.exports = {reply: replyChats};

