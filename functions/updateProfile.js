const userData = require('../DB/SignupDb');
const passwordAuthOps = require('../functions/passwordAuthOps');


function updateProf(req, res){
    let find = {email: req.user.email};
    let update = [];

    if(req.body.first_name !== ""){
        update.push({name:req.body.first_name});
    }
    if(req.body.last_name !== ""){
        update.push({last:req.body.last_name});

    }
    if(req.body.phone !== ""){
        update.push({phone:req.body.phone});
    }
    if(req.body.email !== ""){
        update.push({email:req.body.email});
    }
    console.log('Your password- ',req.body.password);
    if(req.body.password !== undefined){
        passwordAuthOps.forgotPassword(req, res);
    }
    var i =0;
    for(i; i<update.length;i++) {
        userData.findOneAndUpdate(find, update[i], (err, user) => {
            if (err) {
                console.log("There was some error in updating the data");
            } else {
                console.log("Data updated succesfully");
            }
        });
    }
}

module.exports = {updateProfile: updateProf};