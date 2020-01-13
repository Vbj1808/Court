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
        res.render("first",{currentUser: req.user});
        console.log("From Home Page: " + req.user.username);
    }else{
        res.render("first",{currentUser: null});
    }
    Case.find({},(err, foundcase) =>{
        if(err){
            console.log(err);
        }else{
            console.log(foundcase);
        }
        
    });
});

app.get("/:id/newcase",(req,res) =>{
     res.render("newcase",{userId : req.params.id});
    });

app.get("/logout",(req, res) =>{
    req.logout();
    res.redirect("/");
})

app.post("/:id/newcase",(req,res) => {
    var author = {
        id: req.user._id,
        name: req.user.name
    }
    var newCase = new Case({name: req.body.casename, 
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

app.get("/:id/cases",(req, res) => {
    var newcase ;
    Case.find({"author.id" : req.params.id},(err, found) =>{
        if(err){
            console.log(err);
        }else{
            console.log(found);
           res.render("cases",{caseNow : found});
        }
    });
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
     res.redirect('/' + req.user._id + "/dashboard");
 
});

app.get("/:id/dashboard",(req,res) => {
    res.render("clientdashboard",{clientNow : req.user});
});

module.exports = app;