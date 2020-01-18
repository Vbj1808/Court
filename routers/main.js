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
const Lawyer = require("../models/lawyer");
const fs = require("fs");
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
        res.redirect('/' + req.user._id + "/dashboard");
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
    if(req.isAuthenticated()){
        res.render("newcase",{currentUser: req.user, userId : req.params.id});
        console.log("From Home Page: " + req.user.username);
    }else{
        res.render("newcase",{currentUser: null});
    }
     res.render("",{userId : req.params.id});
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
            res.redirect('/' + req.user._id + "/dashboard");
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
           res.render("cases",{caseNow : found,currentUser: req.user});
        }
    });
});
app.get("/login", (req,res) => res.render("clilogin"));

app.get("/register", (req,res) => {
    if(req.isAuthenticated()){
        res.render("rclient",{currentUser: req.user, userId : req.params.id})
        console.log("From Home Page: " + req.user.username);
    }else{
        res.render("rclient",{currentUser: null});
    }
    
});

app.get("/lawregister",(req,res) => {
    if(req.isAuthenticated()){
        res.render("rlawyer",{currentUser: req.user, userId : req.params.id})
        console.log("From Home Page: " + req.user.username);
    }else{
        res.render("rlawyer",{currentUser: null});
    }
});

app.post("/lawregister",(req,res) => {
    var addr = req.body.address + " ," + req.body.city + " = " + req.body.pincode + req.body.state ;  
    var newLawyer = new Lawyer({username : req.body.username ,
         name:req.body.name,
          email:req.body.email,
           mobile:req.body.mobile, 
           dob:req.body.dob,
           address : addr,
           gender: req.body.gender,
           uid : req.body.uid,
           qualification : req.body.qualification
        }) ;
    // newClient.img.data = fs.readFileSync(req.body.image);
    // newClient.img.contentType = 'image/png';
    Lawyer.register(newLawyer, req.body.password , function(err , client){
        if(err){
            console.log(err);
            res.redirect("/");
        }
        // res.redirect("/");
        console.log(newLawyer);
        passport.authenticate("lawyerlocal")(req,res,function(){
            // req.flash("success");
            res.render("first",{currentUser: req.user.username});
        });
    });
});





app.post("/register",function(req,res){
    var addr = req.body.address + " ," + req.body.city + " = " + req.body.pincode + req.body.state ;  
    var newClient = new Client({username : req.body.username ,
         name:req.body.name,
          email:req.body.email,
           mobile:req.body.mobile, 
           dob:req.body.dob,
           address : addr,
           gender: req.body.gender
        }) ;
    // newClient.img.data = fs.readFileSync(req.body.image);
    // newClient.img.contentType = 'image/png';
    Client.register(newClient, req.body.password , function(err , client){
        if(err){
            console.log(err);
            res.redirect("/");
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
    res.render("dashboard",{clientNow : req.user,currentUser: req.user});
});

module.exports = app;