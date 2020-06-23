const chatData = require('../DB/chatDb');
const crypto = require('crypto');
const UserData = require('../DB/SignupDb');
const bot = require('../config/chatBot');
const userCredData = require('../DB/userCredDb');
const UserCredObj = require('../functions/allObjects');
const intent = require('../DB/intents');
const rand = require('random-key');
const demoChatDB = require('../DB/demoChatDB');
const mail = require('./mail');


async function isAssignedBots(doc){
    await doc.forEach(function (data) {
        data.isAssigned = true;
        data.save();
    });
}


function DBObjAssigned(name, category, projectID){
    let chatsObj = {
        botCategory:category,
        projectId:projectID,
        botName:name,
    };

    return chatsObj;
}


class ChatbotOps {

    static renderChatbot(req, res) {
        console.log('chat data is saved');
    }


    static async isDemoOver(req, res) {
        let url = new URL(req.body.domain);
        let domain = {domain_name: url.hostname};
        console.log("domain", url.hostname);
        var bol;

        let user = await UserData.findOne(domain);
        if (!user) {
            console.log("user is not present");
        } else {
            console.log("dmeo", req.body.date, req.body.year, req.body.month);

            if (user.demo) {
                let date = new Date(user.demo_end_date.toString());
                let year = date.getFullYear();
                let month = date.getMonth();
                let dat = date.getDate();
                console.log("remo", dat, year, month);
                if (req.body.year > year) {
                    console.log("first condition");
                    bol = true;
                } else if (req.body.month > month) {
                    console.log("second condition");
                    bol = true;
                } else if (req.body.date > dat) {
                    console.log("Third condition");
                    bol = true;
                } else {
                    console.log("fourth condition");

                    bol = false;
                }
            } else {
                console.log("Fifth condition");
                bol = false;
            }

        }

        if (bol) {
            user.isDemo = false;
            user.save();
        }

        return {cond: bol};

    }


    static chatbotResponse(req, res, user) {
        console.log('ChatbotOps reply to', user.isDemo);


        UserData.findOne({company_id: req.body.company_id})
            .then(user => {
                userCredData.findOne({project_id: req.body.project_id}).then(userCred => {

                    let dict = UserCredObj.clientBotCred(userCred);

                    //Sending all the data to chatbot for answer-

                    bot.f2(req.body.project_id, req.body.text, dict).then(answerChat => {
                        if (user.isBuy) {//This chat is if user buys are chatbot
                            let botId = {company_id: req.body.company_id};
                            console.log('ChatBot answer', answerChat);
                            chatData.findOne(botId, function (err, doc) {
                                //working........



                                let clientMessages = {
                                    ques: req.body.text,
                                    ans: answerChat.fulfillmentText,
                                    intents: answerChat.intent.displayName,
                                };


                                let clientChats = {
                                    session_id:req.body.cookie,
                                    chats:clientMessages,
                                    date: new Date(),
                                };

                                let botsLength = doc.botChats.length;
                                for (var l = 0; l < botsLength; l++) {
                                    if (doc.botChats[l].projectId == req.body.project_id) {
                                        let j = 0;
                                        for(j =0 ;j < doc.botChats[l].sessionChats.length; j++){
                                            if(doc.botChats[l].sessionChats[j].session_id == req.body.cookie){

                                                doc.botChats[l].sessionChats[j].chats.push(clientMessages);
                                                break;
                                            }
                                        }
                                        if(j == doc.botChats[l].sessionChats.length){

                                            doc.botChats[l].sessionChats.push(clientChats);
                                        }
                                     //   doc.botChats[l].sessionChats.chats.push(clientMessages);
                                    }
                                }

                                doc.save().then(result => {
                                    console.log('Your chats data of new database has been saved');
                                }).catch(err => {
                                    console.log('There is some error in saving chat data to new chat DB');

                                });
                            });
                        }else if(user.isDemo){//This demo is for if user buy our demo

                            let demoChat = {
                                ques: req.body.text,
                                ans: answerChat.fulfillmentText,
                                intents:answerChat.intent.displayName,

                            };

                            let clientChats = {
                              Client_User_id:demoChat,
                                date: new Date()
                            };

                            demoChatDB.findOne({company_id:req.body.company_id},  function (err, user) {
                                user.botChats.push(demoChat);
                                let i = 0;
                                let length = user.botChats.length;
                                for(i=0; i < length; i++){
                                    if(user.botChats[i].Client_User_id == req.body.cookie){
                                        user.botChats[i].Client_User_id.push(demoChat);
                                        break;
                                    }
                                    if(i == length){
                                        user.botChats.push(clientChats);
                                    }
                                }


                                user.save().then(result=>{
                                    console.log('You have successfully saved your demo chatbot chats');
                                }).catch(err=>{
                                    console.log('There is some error in saving the demo chats');
                                })
                            })
                        }

                        res.json({
                            answer: answerChat.fulfillmentText
                        });

                    });
                });
            });
    }






    static buyChatbot(req, res) {
        //Assigning the bot to the user after payment
        console.log(req.app.get('price'), req.app.get('quantity'), req.body.payload.payment.entity.email);

        let price = req.app.get('price');
        let email = req.body.payload.payment.entity.email;
        let quantity = req.app.get('quantity');

        console.log("checking companyID", email);

        let botsSchema = {
            name:'none',
            category:'none',
            projectID:'none'
        };


        UserData.findOne({email: email}, function (err, user) {
            console.log("User buying chatbot",quantity);
            let totalQuantity = parseInt(quantity);


            if (user.isDemo && totalQuantity == 1) {
                //Save user data here if the user have demo and the user select only one chatbot
                user.project_id.push(user.demoPId);
                let genID = rand.generate();
                let chatArr = [];
                let DB = DBObjAssigned('none', 'none', user.demoPId);

                chatArr.push(DB);
                let chatsHead = {
                    company_id:user.company_id,
                    botChats: chatArr
                };

                let intentArr = [];
                intentArr.push(DB);

                let intentHeadDB = {
                    company_id:user.company_id,
                    allBots:intentArr,
                    price:price,
                };

                let intents = new intent(intentHeadDB);
                let chats = new chatData(chatsHead);
                user.isDemo = false;
                user.isBuy = true;
                intents.save().then(result=>{
                    console.log("Success");
                }).catch(err=>{
                    console.log('Error occurs', err);
                });
                chats.save().then(result=>{
                    console.log('Successs');
                }).catch(err=>{
                    console.log("Error occured", err);
                });
                user.save();

            } else {
                //Getting the category list from the user select categories-
                //creating all the above objects for botinfo

                let botInfo = [];
                let chatsInfo = [];

                if(user.isDemo){
                    totalQuantity -= 1;

                    user.project_id.push(user.demoPId);


                    let DB = DBObjAssigned('none', 'none', user.demoPId);

                    botInfo.push(DB);
                    chatsInfo.push(DB);

                }

                userCredData.find({isAssigned: false}).limit(totalQuantity).exec(function (err, doc) {
                   // console.log('project_ID', doc);
                    user.isBuy = true;
                    user.isDemo = false;

                    if (err) throw err;
                    if (doc === null) {
                        console.log('Data is not found');
                    } else {

                        for(let i=0;i<totalQuantity;i++){
                            let name = 'bot'+(i+1);
                            console.log('Checking the loop conditions', doc[i].project_id);
                            user.project_id.push(doc[i].project_id);
                            let DB = DBObjAssigned(name, 'none', doc[i].project_id);
                            botInfo.push(DB);
                            chatsInfo.push(DB);
                        }

                        let  botHeadSchema = {
                            company_id:user.company_id,
                            botChats: chatsInfo
                        };
                        let intentHeadSchema = {
                            company_id:user.company_id,
                            allBots:botInfo,
                            price:price
                        };

                        isAssignedBots(doc);

                        user.save().then(result => {
                            console.log('Your data saved to signup');
                        }).catch(err => {
                            console.log('Error in signup db', err);
                        });
                        //console.log('Your data ', botinfo);

                        //Both for loops ends here
                        //saving all the botinfo data to botinfo database
                        intent.findOne({company_id: user.company_id}, (err, intentUser) => {

                            //botInfo bots Schema

                            if (!intentUser) {
                                let intents = new intent(intentHeadSchema);
                                intents.save().then(result => {
                                    console.log('Your botinfo is saved');
                                }).catch(err => {
                                    console.log('There is some error in saving botinfo', err);

                                })
                            }
                        });


                        //Saving all the chatdata to chatdata database
                        chatData.findOne({company_id: user.company_id}, (err, user) => {
                            if (user) {
                                console.log("This data is already stored");
                            } else {

                                //   //saving chats data here
                                let chats = new chatData(botHeadSchema);
                                //  //saving botInfo here
                                chats.save().then(result => {
                                    console.log('Client id is saved to chats data');
                                    mail.sendMail(email, 'Successfully Buy ChatBot','You have buy our chatbot of - '+price);
                                }).catch(err => {
                                    console.log('There is some error in saving client id to chats data');
                                    console.log(err);
                                })
                            }
                        });
                    }
                });
            }

        });
    }
}


module.exports = ChatbotOps;