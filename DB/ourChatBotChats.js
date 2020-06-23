const mongoose = require('mongoose');

console.log('ourBotChats database has been connected....');

let Schema = new mongoose.Schema({
   ques:String,
   ans:String,
   date:String,
   intent:String
});

let HeadSchema = new mongoose.Schema({
   client_id: String,
   chats:[Schema]
});

const model = mongoose.model('ourbotchat', HeadSchema);

module.exports = model;