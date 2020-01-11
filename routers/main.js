const express = require('express');
const app = express();
const passport = require("passport");
const mongoose = require("mongoose");
const Client = require("../models/client");
const bodyParser = require("body-parser");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// app.set('views', __dirname + '/views');
app.get("/",(req,res) => res.render("first"));

app.get("/login", (req,res) => res.render("clilogin"));

app.get("/register", (req,res) => res.render("cliregister"));

app.post("/register",function(req,res){
    var newClient = new Client({username : req.body.username}) ;
    Client.register(newClient, req.body.password , function(err , client){
        if(err){
            console.log(err);
            return res.render("first");
        }
        passport.authenticate("local")(req,res,function(){
            // req.flash("success");
            res.redirect("/");
        });
    });
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/",
        failureRedirect: "/register",
    }), function(req, res){
});

module.exports = app;