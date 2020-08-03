//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const axios = require('axios');
const { response } = require('express');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {

    axios.get(`https://api.hubapi.com/contacts/v1/lists/all/contacts/all?hapikey=${process.env.API_KEY}`)
   .then(function (response){
        //console.log(response.data.contacts[0]["identity-profiles"][0].identities[0].value);
        res.render('index', {data: response.data.contacts});
   });
});

app.post('/addcontact', (req, res) => {
    const newContact = {
        "properties": [
          {
            "property": "email",
            "value": req.body["add-email"]
          },
          {
            "property": "firstname",
            "value": req.body["add-firstname"]
          },
          {
            "property": "lastname",
            "value": req.body["add-lastname"]
          }
        ]
      };

      axios.post(`https://api.hubapi.com/contacts/v1/contact/?hapikey=${process.env.API_KEY}`, newContact)
      .then(function (response) {
        //console.log(response);
        if(response.status === 200){
            res.redirect('/');
        }else{
            res.send("<h1>404 - Bad Request</h1>");
        }
    });

      
});



// app.listen(3000, function(){
//     console.log("Server running on port 3000");
// });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
  console.log("Server running on port 3000");
}
app.listen(port);