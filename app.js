const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require("@mailchimp/mailchimp_marketing");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const API_Key = process.env.mailChimp_API_Key;
const server_ID = process.env.mailChimp_server_key;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended : true
}));

mailchimp.setConfig({
    apiKey: API_Key,
    server: server_ID,
});

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res){
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.emailId;

    var listID = "0dd87a8cd3";

    const subscribingUser = {
        firstName: firstName, 
        lastName: lastName, 
        email: email
    }
    
    const run = async () => {

        try {
            const response = await mailchimp.lists.addListMember(listID , {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });

            res.sendFile(__dirname + "/success.html");

            console.log(response.status); // (optional)
            

        } catch (error) {
            
            console.log(error.status); // (optional)
            console.log(error);
            res.sendFile(__dirname + "/failure.html");
        }

    };

    run();

});

app.post('/failure', (req,res)=>{
    res.redirect('/');
});


app.listen(port, (req,res)=>{
    console.log("Server started at port:3000");
});
