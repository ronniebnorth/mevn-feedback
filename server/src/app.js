const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/tab-tracker');
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});

var User = require("../models/user");
var Feedback = require("../models/feedback");

app.post('/feedback_message', (req, res) => {
	var db = req.db;
	var email = req.body.email;
	var message = req.body.message;
	var feedback_record = new Feedback({
    email: email,
    message: message,
	});

	feedback_record.save(function(error) {
    console.log("Your user has been saved!");
		if (error) {
		  console.error(error);
		}
		res.send({
			message: `Hello ${req.body.email}! your feedback has been posted! Have fun`
		})
	});
})

app.get('/users', (req, res) => {
	User.find({}, 'email fullname', function (err, users) {
		console.log(users);
	  if (err) return handleError(err);
	  res.send({
			users: users
		})
	})
});

app.post('/register', (req, res) => {
	var db = req.db;
	var email = req.body.email;
	var password = req.body.password;
	var user = new User({
    email: email,
    password: password,
	});

	user.save(function(error) {
    console.log("Your user has been saved!");
		if (error) {
		  console.error(error);
		}
		res.send({
			message: `Hello ${req.body.email}! your user was registered! Have fun`
		})
	});
})

app.listen(process.env.PORT || 8081)
