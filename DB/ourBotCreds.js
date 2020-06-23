const mongoose = require('mongoose');


console.log('You are connected to ourBotsCreds database');

const schema = new mongoose.Schema({
   type: String,
   project_id: String,
   private_key_id: String,
   private_key: String,
   client_email: String,
    client_id: String,
    auth_uri: String,
    token_uri:String,
    auth_provider_x509_cert_url:String,
    client_x509_cert_url:String,
});

const model = mongoose.model('ourBotCreds', schema);

module.exports = model;