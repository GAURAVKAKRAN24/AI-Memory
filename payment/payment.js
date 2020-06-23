
    /* initialize an object with request parameters */
    var paytmParams = {

        /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
        "MID": "YOUR_MID_HERE",

        /* Find your WEBSITE in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
        "WEBSITE": "YOUR_WEBSITE_HERE",

        /* Find your INDUSTRY_TYPE_ID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
        "INDUSTRY_TYPE_ID": "YOUR_INDUSTRY_TYPE_ID_HERE",

        /* WEB for website and WAP for Mobile-websites or App */
        "CHANNEL_ID": "YOUR_CHANNEL_ID",

        /* Enter your unique order id */
        "ORDER_ID": "YOUR_ORDER_ID",

        /* unique id that belongs to your customer */
        "CUST_ID": "CUSTOMER_ID",

        /* customer's mobile number */
        "MOBILE_NO": "CUSTOMER_MOBILE_NUMBER",

        /* customer's email */
        "EMAIL": "CUSTOMER_EMAIL",

        /**
         * Amount in INR that is payble by customer
         * this should be numeric with optionally having two decimal points
         */
        "TXN_AMOUNT": "ORDER_TRANSACTION_AMOUNT",

        /* on completion of transaction, we will send you the response on this URL */
        "CALLBACK_URL": "YOUR_CALLBACK_URL",
    };

module.exports = paytmParams;