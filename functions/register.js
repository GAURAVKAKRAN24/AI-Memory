const UserData = require('../DB/SignupDb');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const userRegObj = require('../functions/allObjects');
const mail = require('./mail');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');


function register(req, res) {

    let user = userRegObj.userRegisterInfo(req);
    let data  = new UserData(user);
    console.log(data);



    UserData.findOne({email: data.email})
        .then(user => {
            if (user){
                //User Exist
                req.flash('message','This user is already exist please try again with different ID');
                res.redirect('/insert');

            }else if(req.body.verify !== req.body.password){
                req.flash('message',"Your password does'nt matched");
                res.redirect('/insert');
            }
            else{
                bcrypt.genSalt(10, (err, salt)=> bcrypt.hash(data.password, salt, (err, hash)=>{

                    if(err) throw err;

                    data.password = hash;
                    res.clearCookie('cookie');
                    //remember to make the key as env variable-
                    let crypt = crypto.randomBytes(5).toString('hex');
                    res.cookie('client_cookie', crypt, {httpOnly: true});
                    data.company_id = crypt;
                    data.save()
                        .then(user =>{
                            req.flash('message', 'You are now registered and can log in');
                            mail.sendMail(req.body.email, 'Registered Successfully','You have successfully register with our company.');
                            res.redirect('/');
                        })
                        .catch(err => console.log(err));
                }));
            }
        })
}

module.exports = register;