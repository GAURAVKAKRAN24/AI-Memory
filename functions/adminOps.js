const chatData = require('../DB/chatDb');
const UserData = require('../DB/SignupDb');
const userCredData = require('../DB/userCredDb');
const demoChatDB = require('../DB/demoChatDB');


class AdminOps{
    static  getTotalUsers(){
        let length =  UserData.countDocuments({});
        return length;
    }

    static getTotalBots(){
        let totalBots = userCredData.countDocuments({});
        return totalBots;
    }

    static getTotalAssignedBots(){
        let totalAssignedBots = userCredData.countDocuments({isAssigned:true});
        return totalAssignedBots;
    }

    static getUnAssignedBots(){
        let UnAssignedBots = userCredData.countDocuments({isAssigned: false});
        return UnAssignedBots;
    }

    static getAllDemoUsers(){
        let users = UserData.find({isDemo: true});
        return users;
    }

    static getAllBotSubscriptionUsers(){
        let users = UserData.find({isBuy:true});
        return users;
    }

}



module.exports = AdminOps;