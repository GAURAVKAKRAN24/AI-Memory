const mongoose = require('mongoose');
const passportLocalMongoose  = require('passport-local-mongoose');


console.log("You are connected to MongoDB database....");

//Creating Schema-

const Schema = new mongoose.Schema({
    company_id:{type:String, unique:true},
    username: {type: String, unique: true},
    name: {type: String},
    last: {type: String},
    email: {type:String},
    phone: {type: Number},
    password:{type: String},
    resetPasswordToken:{type: String},
    project_id: [String],
    demo_start_date: Date,
    demo_end_date: Date,
    bot_buy_date:Date,
    demoPId:String,
    isDemo: {type: Boolean, default: false},
    isBuy: {type: Boolean, default: false},
});


Schema.plugin(passportLocalMongoose);


//Creating the database model-
var model  = mongoose.model('UserData', Schema);



module.exports = model;