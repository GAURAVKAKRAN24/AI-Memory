const mongoose = require('mongoose');

console.log('Intents database has been connected....');

const botsSchema = new mongoose.Schema({
    botCategory:{type:String},
    projectId:{type:String},
    botName:{type:String},
    botIntents:[String],
});

const Schema = new mongoose.Schema({
    company_id: {type:  String, unique:true},
    allBots:[botsSchema],
    allIntents: [String],
    price:String
});

const model = mongoose.model('botInfo', Schema);

module.exports = model;