
function ObjInit(userCred) {

        const obj = {type: userCred.type,
        project_id: userCred.project_id,
        private_key_id: userCred.private_key_id,
        private_key: userCred.private_key,
        client_email: userCred.client_email,
        client_id: userCred.client_id,
        auth_uri: userCred.auth_uri,
        token_uri:userCred.token_uri,
        auth_provider_x509_cert_url:userCred.auth_provider_x509_cert_url,
        client_x509_cert_url:userCred.client_x509_cert_url,}
        return obj;
};


function regInfo(req){

        const user = {
                username: req.body.UserName,
                name: req.body.name,
                last: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                password:req.body.password,
        };
        return user;

}

module.exports = {clientBotCred: ObjInit,
                userRegisterInfo: regInfo};
