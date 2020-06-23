document.addEventListener('DOMContentLoaded', function () {
    startTime()

});

function startTime() {

    var today = new Date();

    let date = {
        d: today.getDate(),
        m:today.getMonth(),
        y:today.getFullYear(),
    };


    console.log('data has been called');
    fetch('/data', {
        method: 'POST',
        body: JSON.stringify(date)
    }).then((resp)=>{
        return resp.json();
    }).then((data)=>{
        let users = data.user;
        for(var i=0;i<users.length;i++){
            let getDate = new Date(users[i].demo_end_date.toString());


            console.log(users[i]);
        }
    });


  //  var t = setTimeout(startTime, 2000);

}
