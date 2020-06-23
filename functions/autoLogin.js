function autoLogin(req ,res){
    console.log(req.cookies['client_cookie']);
}
module.exports = autoLogin;
