
$('#exampleInputEmail1').click(function () {
    window.alert('If you want to change Email you need to SignUp with different email');
});

$('#exampleInputPassword1').click(function () {
    window.alert('You can change your password from your profile');
});

let order_id  = null;


console.log('payment is called');
document.getElementById('subscription').onclick = async function (e) {

    await fetch('/payment').then(result=>{
        return result.json();
    }).then(data=>{
        options.subscription_id = data.id;
        order_id = data.id;
        
        let payment = new window.Razorpay(options);

        payment.open();
        e.preventDefault();
    });

};


let options = {
    "key": "rzp_test_1VGUCx5bA5SiGQ",
    "subscription_id": "",
    "name": "AIM AI Memory",
    "description": "ChatBot ProPlan",
    "handler": function(response) {
            let elemnt = document.querySelector('#scr').setAttribute('data-order_id',order_id);
            console.log('script', elemnt);
            document.querySelector('#pay').submit();
            console.log('success route is called');

           // alert(response.razorpay_payment_id),
           // alert(response.razorpay_subscription_id),
          //  alert(response.razorpay_signature);
    },
};

