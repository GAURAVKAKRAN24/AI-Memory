const mongoose = require('mongoose');

console.log('Chat database has been connected....');

const sessions = new mongoose.Schema({
    ques: String,
    ans: String,
    intents:String,
});


const clientIntents = new mongoose.Schema({
    session_id:String,
    chats:[sessions],
    date:String,
});

const botInfo = new mongoose.Schema({
    botCategory:{type:String},
    projectId:{type:String},
    botName:{type:String},
    sessionChats:[clientIntents],
});

const Schema = new mongoose.Schema({
    company_id: {type:  String, unique:true},
    botChats:[botInfo],
});

const model = mongoose.model('ChatData', Schema);

module.exports = model;