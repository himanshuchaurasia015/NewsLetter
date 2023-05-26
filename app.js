const express = require("express");
const https = require("https");

const bodyParser = require("body-parser");

const app = express();

app.use("/public", express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));

// On the home route, send signup html template

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

// Manage post request on home route and
// Send data to the MailChimp account via  API
app.post("/", (req, res) => {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  // Converting string data to JSON data 44004b41ee
  const jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/44004b41ee";

  const options = {
    method: "POST",
    auth: "himanshu:23053531e228b5b208fef43142cb7a08-us21",
  };

  // On success send users to success, otherwise on failure template

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

// Failure route
app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("server is running");
});
