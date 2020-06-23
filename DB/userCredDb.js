const mongoose = require('mongoose');

console.log('You are connected to userCred database');

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
    isAssigned: {type: Boolean, default: false},
});

const model = mongoose.model('userCredInfo', schema);

module.exports = model;