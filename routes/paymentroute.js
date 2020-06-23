const express = require('express');
const router = express();
const fetch = require('node-fetch');
var request = require('request');
let razorpay = require('razorpay');
const chatbotOps = require('../functions/chatbotOps');
const crypto = require('crypto');
const userData = require('../DB/SignupDb');
const paymentData = require('../DB/paymentDB');

router.get('/payment', function (req, res, next) {

    fetch('https://rzp_test_1VGUCx5bA5SiGQ:CM2rXGqFPpRYOVgmwFNpzpUb@api.razorpay.com/v1/subscriptions', {
        method: 'post',
        body: JSON.stringify({
            plan_id: "plan_EsujcIzKUi1opF",
            total_count: 12,
            customer_notify: 1,
        }),
        headers: {'Content-Type': 'application/json'},
    })
        .then(result => result.json())
        .then(json => {

            res.json({
                id: json.id
            });
           
        });

});


router.post('/success', function (req, res, next) {
    console.log('Payment succeed');
    res.render('testing');
});


async function que(events) {

}


//Subscription active status
router.post('/paymentPage', async function (req, res, next) {


    const secret = '12345678';
    // console.log('Our WebHooks', req.body.payload);

    const sha = crypto.createHmac('sha256', secret);
    sha.update(JSON.stringify(req.body));
    const digest = sha.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
        console.log('password matched');
        let event = req.body.event;
        let email = req.body.payload.payment.entity.email;
        if (event === 'subscription.charged') {
            paymentData.findOne({customer_id: req.body.payload.payment.entity.customer_id}, (err, docs) => {
                let payment = {
                    payment_id: req.body.payload.payment.entity.payment_id,
                    entity: req.body.payload.payment.entity.entity,
                    amount: req.body.payload.payment.entity.amount,
                    currency: req.body.payload.payment.entity.currency,
                    order_id: req.body.payload.payment.entity.order_id,
                    international: req.body.payload.payment.entity.international,
                    method: req.body.payload.payment.entity.method,
                    captured: req.body.payload.payment.entity.captured,
                    card_id: req.body.payload.payment.entity.card_id,
                };

                if (!docs) {
                    chatbotOps.buyChatbot(req, res);
                    userData.findOne({email: email}, (err, user) => {

                        let subscriptionSchema = {
                            company_id: user.company_id,
                            subscription_id: req.body.payload.subscription.entity.id,
                            entity: req.body.payload.subscription.entity.entity,
                            plan_id: req.body.payload.subscription.entity.plan_id,
                            customer_id: req.body.payload.subscription.entity.customer_id,
                            status: req.body.payload.subscription.entity.status,
                            current_start: req.body.payload.subscription.entity.current_start,
                            current_end: req.body.payload.subscription.entity.current_end,
                            charge_at: req.body.payload.subscription.entity.charge_at,
                            end_at: req.body.payload.subscription.entity.end_at,
                            start_at: req.body.payload.subscription.entity.start_at,
                            paid_count: req.body.payload.subscription.entity.paid_count,
                            expire_by: req.body.payload.subscription.entity.expire_by,
                            email: user.email,
                            contact: user.phone,
                            payments: payment
                        };

                        let paymentdata = new paymentData(subscriptionSchema);
                        paymentdata.save().then(result => {
                            console.log('Your subscription data has been saved');
                        }).catch(err => {
                            console.log('There is some problem in saving the subscription data');
                        })

                    });
                }else{
                    docs.charge_at = req.body.payload.subscription.entity.charge_at;
                    docs.paid_count = req.body.payload.subscription.entity.paid_count;
                    docs.expire_by = req.body.payload.subscription.entity.expire_by;
                    docs.current_start = req.body.payload.subscription.entity.current_start;
                    docs.current_end = req.body.payload.subscription.entity.current_end;
                    docs.start_at = req.body.payload.subscription.entity.start_at;
                    docs.end_at = req.body.payload.subscription.entity.end_at;
                    docs.payments.push(payment);
                    docs.save().then(results=>{
                        console.log('Subscription charged is saved');
                    }).catch(err=>{
                        console.log('Problem in subscription charged saving');
                    })
                }
            });
        }


        console.log('subscription called');
    }

    res.json({status: 'ok'});

});


router.get('/paymentPage', function (req, res, next) {


    if (req.user == undefined) {
        req.flash('message', 'Please log-in first');
        res.redirect('/');
    } else {

        let quantity = req.query.quantity;
        let price = req.query.price;
        let email = req.user.email;
        let phone = req.user.phone;
        req.app.set('quantity', quantity);
        req.app.set('price', price);

        res.render('paymentRoute', {success: null, price: price, quantity: quantity, email: email, phone: phone});

    }

});


module.exports = router;