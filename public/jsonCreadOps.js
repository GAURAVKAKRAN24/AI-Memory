$(document).ready(function () {
   let input = document.getElementById('credFile');
   input.addEventListener('change', function (evt) {
       console.log(input.files);
       let reader = new FileReader();

       reader.onload = function(e){
           let text = e.target.result;
           let json  = JSON.parse(text);

          fetch('file/',{
              method:'POST',
              headers:{
                  'Content-Type':'application/json',
              },
              body: JSON.stringify({
                  type: json.type,
                  project_id: json.project_id,
                  private_key_id: json.private_key_id,
                  private_key: json.private_key,
                  client_email: json.client_email,
                  client_id: json.client_id,
                  auth_uri: json.auth_uri,
                  token_uri:json.token_uri,
                  auth_provider_x509_cert_url:json.auth_provider_x509_cert_url,
                  client_x509_cert_url:json.client_x509_cert_url,
              })
          }).then((res)=>{
              return res;
          }).then((data)=>{
              console.log(data);
          })
       };

       reader.readAsText(input.files[0]);
   },false);
});