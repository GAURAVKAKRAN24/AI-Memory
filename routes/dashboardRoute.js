const router = require('express').Router();
var mongoose = require('mongoose');
var ClientChatDb = require('../DB/chatDb');
const { ensureAuthenticated } = require('../config/auth');


months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]  // to map
pastDaysElement = [];
var today = new Date();


// to make console.log the python way
function print(toPrint){
    console.log(toPrint);
}


// calculates past n day'th date and returns it
function calcPastDate(past_days) {
    return (new Date(today.getTime() - (past_days * 24 * 60 * 60 * 1000)));
}


function msgsFreq(pastDaysElement, day){
    var msgCounter = 0;
    var sessionCounter = 0;

    pastDaysElement.forEach(element => {
        if (new Date(element.date).getDate() == day){
            // print(element.chats.length)
            msgCounter = msgCounter + (element.chats.length);
            sessionCounter = sessionCounter +1;
            
        }    
    }); 
    return [msgCounter, sessionCounter];
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


// route to show Dashboard
router.get('/:requested_bot?', function(req, res){


    var total_sessions = []
    var msgsfreqData = [];
    var sessionfreqData = [];
    var Labels = [];
    var freq;

    // past 10 days labels and frequency
    ClientChatDb.find({company_id: req.user.company_id}, function(err, data){

        var allBots = getAllBots(data[0])
        req_bot = allBots[0]

        if (req.params.requested_bot == undefined){
            console.log("parameter undefined")
            if (!req_bot){
                console.log("no req bot")
                res.render('dash', {user_data: {name: req.user.name, lineChartLabels: [], msgChartData: [],
                                                sessionChartData: [], botNames: allBots}})
            }else {
                console.log("req bot is present")
                res.redirect(req.protocol + '://' + req.get('host') + req.originalUrl + '/' + req_bot);
            }
        } else if (req.params.requested_bot){
            if (!allBots.includes(req.params.requested_bot)){
                res.sendStatus(404)
            } else{

                data[0].botChats.forEach(element => {
                    if (element.botName == req_bot){
                        var mainBotElement = element;
    
                        // Get Past 10 days all data, so that we do not need to loop on whole data again and again.
                        mainBotElement.sessionChats.forEach(element => {
                            var stored_date = new Date(element.date)
                            if (stored_date <= today && stored_date>= calcPastDate(10)){
                                pastDaysElement.push(element);
                            }        
                        });
    
                        for (var days=9; days>=0; days--){
                            var last = calcPastDate(days);
                            var date =last.getDate();
                            var month=last.getMonth();
                            freq = msgsFreq(pastDaysElement, date)
                
                            msgsfreqData.push(freq[0])
                            sessionfreqData.push(freq[1])
                            Labels.push(date+'-'+months[month])
                            
                        }
    
                        res.render('dash', {user_data: {name: "Aakash", lineChartLabels: Labels,
                                            msgChartData: msgsfreqData,
                                            sessionChartData: sessionfreqData,
                                            botNames: allBots}})
    
                    }
            })  
        }
    }
    });
})



        
    //     if (req.params.requested_bot && allBots.length>0){
    //         var req_bot = req.params.requested_bot;
    //         print('yes requested bot: '+ req_bot)

    //         data[0].chatbots.forEach(element => {
    //             if (element.bot.name == req_bot){
    //                 var mainBotElement = element;
    //                 print(1)

    //                 // Get Past 10 days all data, so that we do not need to loop on whole data again and again.
    //                 mainBotElement.bot.sessions.forEach(element => {
    //                     var stored_date = new Date(element.session_time)
    //                     if (stored_date <= today && stored_date>= calcPastDate(10)){
    //                         pastDaysElement.push(element);
    //                     }        
    //                 });

    //                 print(2)
    //                 for (var days=19; days>=0; days--){
    //                     var last = calcPastDate(days);
    //                     var date =last.getDate();
    //                     var month=last.getMonth();
    //                     freq = msgsFreq(pastDaysElement, date)
            
    //                     msgsfreqData.push(freq[0])
    //                     sessionfreqData.push(freq[1])
    //                     Labels.push(date+'-'+months[month])
                        
    //                 }

    //                 print(3)
    //                 res.render('dash', {user_data: {name: "Aakash", lineChartLabels: Labels,
    //                                     msgChartData: msgsfreqData,
    //                                     sessionChartData: sessionfreqData,
    //                                     botNames: allBots}})

    //             }
    //         });
    //     }else{
    //         var req_bot = allBots[0];
    //         print('No requested bot')
    //         res.redirect(req.protocol + '://' + req.get('host') + req.originalUrl + '/' + req_bot);
    //     }    
    // })
    // } else {
    //     res.render('dash', {user_data: {name: req.user.name, lineChartLabels: [],
    //                                     msgChartData: [],
    //                                     sessionChartData: [],
    //                                     botNames: allBots}})
    // }
    
    



module.exports = router;