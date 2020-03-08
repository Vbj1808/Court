const router = require('express').Router();
// const app = express();
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
const upload = require("express-fileupload");
const PendingCase = require("../models/pending");
// app.use(upload());
const ejs = require("ejs");
const pdf = require("html-pdf");
var multer  = require('multer');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('AuthKey');
const SMS = require('node-sms-send');


router.get("/",(req,res)=>{
    res.send("Hi");
});


router.post("/login", passport.authenticate("local", function(err,user,info){

        if(err){
            console.log("Inside Mobile Post Error : " + err);
        }else {
            console.log("Inside Mobile Post : " + user);

            req.logIn(user, function(err) {
                if (err) { console.log("Inside Mobile Post Error1 : " + err);
                }else{
                    console.log("Logged In Sucessfully : ");
                }
                
              });
        }
})

);


module.exports = router;