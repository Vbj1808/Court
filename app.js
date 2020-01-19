const express = require('express');
const app = express();
const port = 3400 ;
const main = require("./routers/main");
const mongoose = require("mongoose");
const Client = require("./models/client");
const Lawyer = require("./models/lawyer");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
var bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/yelp_camp';

mongoose.connect('mongodb+srv://rclemsmith:Smith_2000@court-kddyl.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected To Database");
})

app.set('view engine', 'ejs');
app.use("/",main);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Client.authenticate()));
// passport.use('lawyerlocal',new LocalStrategy(Lawyer.authenticate()));
passport.serializeUser(Client.serializeUser());
passport.deserializeUser(Client.deserializeUser());
// passport.serializeUser(Lawyer.serializeUser());
// passport.deserializeUser(Lawyer.deserializeUser());

app.listen(process.env.PORT || 3500, process.env.IP, () => console.log('Example app listening on port ' + process.env.PORT ));