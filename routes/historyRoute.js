const router = require('express').Router();
var mongoose = require('mongoose');
var ClientChatDb = require('../DB/chatDb');

const { ensureAuthenticated } = require('../config/auth');


function print(toPrint){
    console.log(toPrint);
}

function getAllBots(doc){
    
    var botNamesList = []
    try {
        doc.botChats.forEach(botElement => {
            botNamesList.push(botElement.botName)
        });
    }
    catch(err){
        console.log("error getting all bots of client:", err)
    }
    return botNamesList
}



// route to show history
router.get('/:requested_bot?', function(req, res){

    var total_sessions = []
   
    

    ClientChatDb.find({company_id: req.user.company_id}, function(err, data){

        
        var allBots = getAllBots(data[0])
        req_bot = allBots[0]


        if (req.params.requested_bot == undefined){
            console.log("parameter undefined")
            if (!req_bot){
                console.log("no req bot")
                res.render('history', {user_data: {'name': req.user.name, data: [], botNames: []}})
            }else {
                console.log("rendering to", req_bot)
                res.redirect(req.protocol + '://' + req.get('host') + req.originalUrl + '/' + req_bot);
            }
        }else if (req.params.requested_bot){
            console.log("inside ")
            if (!allBots.includes(req.params.requested_bot)){
                res.sendStatus(404)
            }else {
                console.log("else")
                data[0].botChats.forEach(element => {
                console.log("got bots")
                if (element.botName == req_bot){
                    console.log('condition')
                    var mainBotElement = element;
        
                    res.render('history', {user_data: {'name': req.user.name, data: mainBotElement.sessionChats,
                                        botNames: allBots}})
                     }
                 });
                }
            }
        })
    

    
    // ClientChatDb.find({email: req.user.email}, function(err, data){
    //     var allBots = getAllBots(data[0])
    //     if (req.params.requested_bot){
    //         var req_bot = req.params.requested_bot;
    //         print(req_bot)
    //     }else{
    //         var req_bot = allBots[0];
    //         res.redirect(req.protocol + '://' + req.get('host') + req.originalUrl + '/' + req_bot);
    //     } 

    //     data[0].chatbots.forEach(element => {
    //         if (element.bot.name == req_bot){
    //             var mainBotElement = element;
    
    //             res.render('history', {user_data: {'name': req.user.name, data: mainBotElement.bot.sessions,
    //                                 botNames: allBots}})
    //         }
    //     });
        
    // })
    
});


module.exports = router;
