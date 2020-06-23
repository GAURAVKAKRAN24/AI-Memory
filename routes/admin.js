const express = require('express');
const router = express();
const admin = require('../functions/adminOps');



router.get('/admin', function (req, res, next) {
    console.log('Admin page is called');

    admin.getTotalUsers().then((result=>{
        console.log('Total Users', result);
    }));

    admin.getTotalBots().then((result=>{
        console.log('Total Bots', result);
    }));

    admin.getTotalAssignedBots().then((result=>{
        console.log('Total Assigned Bots', result);
    }));

    admin.getUnAssignedBots().then((result=>{
        console.log('Total UnAssigned Bots', result);
    }));

    admin.getAllDemoUsers().then(result=>{
        console.log('Demo Users', result);
    });

    admin.getAllBotSubscriptionUsers().then(result=>{
        console.log('Subscription Users', result);
    })

});

module.exports = router;