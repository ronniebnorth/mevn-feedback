const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')
const morgan = require('morgan')
const flash = require('express-flash')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy
const passport = require('passport');
const RedisStore = require('connect-redis')(session);

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser('keyboard cat'));
app.use( session({
	secret: 'cookie_secret',
	name:   'kaas',
	store:  new RedisStore({
		host: '127.0.0.1',
		port: 6379
	}),
	proxy:  true,
    resave: true,
    saveUninitialized: true
}));
app.use( passport.initialize());
app.use( passport.session());
app.use(flash());


// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var GOOGLE_CLIENT_ID      = "1079293403360-dbjudkrima3hf8t192o1dodlnu5ifas5.apps.googleusercontent.com"
  , GOOGLE_CLIENT_SECRET  = "zTsR6Oa9ZQmfLaaasxtZyuxW";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    //NOTE :
    //Carefull ! and avoid usage of Private IP, otherwise you will get the device_id device_name issue for Private IP during authentication
    //The workaround is to set up thru the google cloud console a fully qualified domain name such as http://mydomain:3000/
    //then edit your /etc/hosts local file to point on your private IP.
    //Also both sign-in button + callbackURL has to be share the same url, otherwise two cookies will be created and lead to lost your session
    //if you use it.
    callbackURL: "http://localhost:8080/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mevn-feedback');
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
		req.flash('info', 'Welcome');
		res.send({
			message: `Hello ${req.body.email}! your feedback has been posted! Have fun`
		})
	});
})

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google', passport.authenticate('google', { scope: [
       'https://www.googleapis.com/auth/plus.login',
       'https://www.googleapis.com/auth/plus.profile.emails.read']
}));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get( '/auth/google/callback',
    	passport.authenticate( 'google', {
    		successRedirect: '/',
    		failureRedirect: '/register'
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/users', (req, res) => {
	User.find({}, 'email fullname', function (error, users) {
	  if (error) { console.error(error); }
	  res.send({
			users: users
		})
	})
})

app.get('/feedbacks', (req, res) => {
	Feedback.find({}, 'email message', function (error, feedbacks) {
	  if (error) { console.error(error); }
	  res.send({
			feedbacks: feedbacks
		})
	}).sort({_id:-1})
})

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

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
