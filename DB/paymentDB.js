const mongoose = require('mongoose');
//const passportLocalMongoose = require('passport-local-mongoose');


//MongoDb Atlas key

console.log("You are connected to MongoDB database....");


//Creating Schema-
const payment = new mongoose.Schema({
   payment_id:String,
   entity:String,
   amount:String,
   currency:String,
   order_id:String,
   international:Boolean,
   method:String,
   captured:String,
   card_id:String,
});



const Schema = new mongoose.Schema({
   company_id:{String},
   subscription_id:String,
   entity:String,
   plan_id:String,
   customer_id:String,
   status:String,
   current_start:String,
   current_end:String,
   charge_at:String,
   end_at:String,
   start_at:String,
   paid_count:String,
   expire_by:String,
    email:String,
    contact:String,
   payments:[payment],
});

//Schema.plugin(passportLocalMongoose);
//Creating the database model-
var model  = mongoose.model('payment', Schema);

module.exports = model;