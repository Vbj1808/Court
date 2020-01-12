const express = require('express');
const app = express();
const passport = require("passport");
const mongoose = require("mongoose");
const Client = require("../models/client");
const bodyParser = require("body-parser");
const middleware = require("../middleware");
const { isLoggedIn } = middleware;
const session = require("express-session");
const cookieParser = require("cookie-parser");
const Case = require("../models/cases");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }))
app.use(passport.initialize());
app.use(passport.session());

// app.set('views', __dirname + '/views');
app.get("/",(req,res) => {
    if(req.isAuthenticated()){
        res.render("first",{currentUser: req.user.username});
        console.log("From Home Page: " + req.user.username);
    }else{
        res.render("first",{currentUser: null});
    }
});

app.get("/newcase",(req,res) => res.render("newcase"));

app.post("/newcase",(req,res) => {
    var author = {
        id: req.user._id,
        name: req.user.name
    }
    var newCase = new Case({name: req.body.name, 
                            type: req.body.type,
                            description: req.body.desc,
                            lawyer : req.body.lawyer,
                            author : author
                        });
    Case.create(newCase, (err, newcase) => {
        if(err){
            console.log(err)
        }else{
            res.redirect("/");
        }
    })
});
app.get("/login", (req,res) => res.render("clilogin"));

app.get("/register", (req,res) => res.render("cliregister"));

app.post("/register",function(req,res){
    var newClient = new Client({username : req.body.username , name:req.body.name, email:req.body.email, mobile:req.body.mobile, dob:req.body.dob}) ;
    Client.register(newClient, req.body.password , function(err , client){
        if(err){
            console.log(err);
            return res.render("first");
        }
        // res.redirect("/");
        passport.authenticate("local")(req,res,function(){
            // req.flash("success");
            res.redirect("/");
        });
    });
});

app.post("/login", passport.authenticate("local", 
    {
        failureRedirect: "/register",
    }), function(req, res){

     console.log(req.user);
     req.session.user = req.user;
     res.redirect('/');
 
});

module.exports = app;