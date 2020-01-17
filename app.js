const express = require('express');
const app = express();
const port = 3400 ;
const main = require("./routers/main");
const mongoose = require("mongoose");
const Client = require("./models/client");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
var bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/yelp_camp';

mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true});
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
passport.serializeUser(Client.serializeUser());
passport.deserializeUser(Client.deserializeUser());

app.listen(port, () => console.log(`Example app listening on port ${port}!`))