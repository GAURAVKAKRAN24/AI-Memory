const mongoose = require('mongoose');

console.log('demoChat database has been connected....');


const chats  = new mongoose.Schema({
    ques: String,
    ans: String,
    intents:String,
    date:Date,
});

const clientIntents = new mongoose.Schema({
    Client_User_id:[chats],
});



const Schema = new mongoose.Schema({
    company_id: {type:  String, unique:true},
    botChats: [clientIntents],
});


const model = mongoose.model('demoChats', Schema);

module.exports = model;