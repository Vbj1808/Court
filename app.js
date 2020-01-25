const express = require('express');
const app = express();
const port = process.env.PORT || 3500 ;
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
});

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
// var server = require('http').Server(app);
// server.listen(3600);
var socket = require("socket.io");




var server = app.listen(port, process.env.IP, () => console.log('Example app listening on port ' + process.env.IP ));

var io = socket(server);

io.on('connection',(socket)=>{
  console.log("Client Connected");
  // socket.emit('Boom',{name : "Clement SMith is my Name"});

  socket.on('SendMsg', function (data) {
      console.log("To " + data.to + " : " + data.message);
      io.sockets.emit("Boom",data);
    });
    socket.on('Boom', function (data) {
      console.log("To " + data.to + " : " + data.message);
    });

    socket.on("LawyerBoom",function(data){
          io.sockets.emit("UserBoom",data);
    });
});