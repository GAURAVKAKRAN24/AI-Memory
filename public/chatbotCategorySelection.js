document.addEventListener('DOMContentLoaded', function () {
    let quantity =  $('#quantity');
    let price = $('#price');

    console.log('quantity', quantity.attr('value'));
    let quantityValue = quantity.attr('value');
    let priceValue = price.attr('value');
    $('#but').on('click', function () {
        fetch('/buyBotSubmit', {
            method: 'POST',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                quantity:quantityValue,
                price:priceValue
            })
        }).then(result=>{
            console.log('Success');
        }).catch(err=>{
            console.log('Error occured');
            console.log(err);
        })
    })

});
