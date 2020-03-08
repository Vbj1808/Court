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
const upload = require("express-fileupload");
const PendingCase = require("../models/pending");
app.use(upload());
const ejs = require("ejs");
const pdf = require("html-pdf");
var multer  = require('multer');
const SendOtp = require('sendotp');
const sendOtp = new SendOtp('AuthKey');
const SMS = require('node-sms-send');
 
const sms = new SMS('username', 'password')
const otpGen  = require("otp-generator");
const otpTool = require("otp-without-db"); 
const key     = "secretKey";

const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: '8759d329',
  apiSecret: '10aHwdAXCKUsARcW',
});

const accountSid = 'ACe77a97bc8c0b00f967a994e68b0ba889';
const authToken = 'd4b8444e6bdc35d911fbf09a8344c57e';
const client = require('twilio')(accountSid, authToken);

const PORT = process.env.PORT || 3800

const multerConf = {
    // storage : multer.diskStorage({
    //     destination : function(req,file,next){
    //             next(null,'../public/images');
    //     }
    // }),
    filename : function(req,file,next){
        console.log(file);
    }
}
const bcrypt = require("bcrypt");
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
            // console.log(foundcase);
        }
        
    });
});

app.get("/mobilestatus",(req,res)=>{
    res.render("mobileform",{currentUser: null});
});

app.post("/mobilestatus",(req,res)=>{
    // sendOtp.send(Number(req.body.mobileno),"PRIIND",(err,data)=>{
    //     console.log(data);
    //     res.render("otpstatus",{currentUser: null});
    // });
    var number = "+91" + req.body.mobileno ;
//     sms.send(number, 'Hello!')
//   .then(body => console.log(body)) // returns { message_id: 'string' }
//   .catch(err => console.log(err.message))

// let otp   = otpGen.generate(6, { upperCase: false, specialChars: false, alphabets: false });  

// let hash = otpTool.createNewOTP(number,otp,key);
// const from = 'Nexmo';
// const to = '919003286330';
// const text = 'Hello from Nexmo';
// nexmo.message.sendSms(from, to, text,(err, responseData) => {
//     if (err) {
//         console.log(err);
//     } else {
//         if(responseData.messages[0]['status'] === "0") {
//             console.log("Message sent successfully.");
//         } else {
//             console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
//         }
//     }
// });
// client.messages
//   .create({
//      body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
//      from: '+917550145401',
//      to: '+919003286330'
//    })
//   .then(message => {console.log(message.sid);res.render("otpstatus",{currentUser: null});});
  res.render("otpstatus",{currentUser: null});

    
});

app.get("/:id/casedetails",(req,res)=>{
    Case.findById(req.params.id,(err,found)=>{
        res.render("casedetails1",{currentUser: null , caseNow: found, lawyers: JSON.stringify(found.lawyer)});
        
    });
    
});

// io.on('connection',(socket)=>{
//     console.log("Client Connected");
//     // socket.emit('Boom',{name : "Clement SMith is my Name"});

//     socket.on('SendMsg', function (data) {
//         console.log("To " + data.to + " : " + data.message);
//         io.sockets.emit("Boom",data);
//       });
//       socket.on('Boom', function (data) {
//         console.log("To " + data.to + " : " + data.message);
//       });

//       socket.on("LawyerBoom",function(data){
//             io.sockets.emit("UserBoom",data);
//       });
// });

app.get("/:id/pending",(req,res)=>{
    PendingCase.find({"lawyer.id" : req.params.id},(err,found)=>{
        console.log(found);
        console.log("Lawyer Name  : " + found[0].lawyer.name)
        res.render("pending",{currentUser: found[0].lawyer , currentCase: found});
    });
    
});

app.get("/:id/negotiate",(req,res)=>{
    PendingCase.findById(req.params.id,(err,found)=>{
        if(err){
            console.log(err);
        }else{
            res.render("negotiate",{caseNow : found, currentUser: null ,users: JSON.stringify(found.author),lawyers: JSON.stringify(found.lawyer)});
        }
    });
});

app.get("/:id/modifycase",(req,res)=>{
    Case.findById(req.params.id,(err,found)=>{
        res.render("caseinput",{currentUser: null , caseNow: found});
    });
    
});

app.get("/:id/newcase",(req,res) =>{
    if(req.isAuthenticated()){
        Lawyer.find({},(err,found) => {
            if(found){
                res.render("newcase",{currentUser: req.user, userId : req.params.id, lawyers: JSON.stringify(found)});
                console.log("From Home Page: " + req.user.username);
            }else{
                console.log(err);
            }
            
        });
        
    }else{
        res.render("newcase",{currentUser: null});
    }
    });

app.get("/logout",(req, res) =>{
    req.logout();
    res.redirect("/");
})

app.post("/:id/newcase",(req,res) => {
    
   
    Lawyer.find({name : req.body.lawyer},(err,found)=>{
        console.log(found);
        if(err){
            console.log(err);
        }else{
        var author = {
            id: req.user._id,
            name: req.user.name
        }
        var lawyerr = {
            name : found[0].name,
            id : found[0]._id
        }
        
        var newCase = new PendingCase({name: req.body.casename, 
            type: req.body.type,
            description: req.body.desc,
            lawyer : lawyerr,
            author : author,

        });
            PendingCase.create(newCase, (err, newcase) => {
            if(err){
            console.log(err)
            }else{
                res.redirect('/' + req.user._id + "/dashboard");
                }
         });
        }
        });
    
    
});

app.get('/casetypes',(req,res)=>{
    res.render("typeofcase",{currentUser: null});
});

app.get("/:id/clientpending",(req,res)=>{
    PendingCase.find({"author.id" : req.params.id},(err,found)=>{
        if(err){
            console.log(err);
        }else{
            console.log(found);
            res.render("pendingclient",{caseNow : found,currentUser: req.user})
        }
    });
});


app.get("/:id/viewpendingcase",(req,res)=>{
    PendingCase.findById(req.params.id,(err,found)=>{
        if(err){
            console.log(err);
        }else{
            res.render("pendingcasedetails",{caseNow : found,currentUser: req.user ,users: JSON.stringify(found.author),lawyers: JSON.stringify(found.lawyer)})
        }
    });
});
app.post("/:id/modifycase",(req,res,)=>{
    // if(req.files){
    //     console.log(req.files.docs);
    // }
    // var fil = {data: Buffer, contentType: String};
    // fil.data = fs.readFileSync((req.files.docs));
    // fil.contentType = 'image/png';

    Case.findByIdAndUpdate(req.params.id,{$set:{firsthearing : req.body.firsthearing, 
        nexthearing: req.body.nexthearing , 
        status: req.body.status, 
        comment : req.body.comment , 
        courtno: req.body.courtno, 
        judge: req.body.judge, 
        }},{new:true},(err,updated) =>{
            if(err){
                console.log(err)
            }else{
                console.log(updated);
                res.redirect("/" + req.params.id + "/modifycase");
            }
            
        });
});


app.get("/:id/cases",(req, res) => {
    var newcase ;
    Case.find({"author.id" : req.params.id},(err, found) =>{
        if(err){
            console.log(err);
        }else{
            // console.log(found);
           res.render("cases",{caseNow : found,currentUser: req.user});
        }
    });
});

app.get("/courtlogin",(req,res)=>{

    res.render("courtlogin",{currentUser:null});
});

app.post("/courtlogin",(req,res) => {
    if(req.body.username === req.body.password){
    Case.find({},(err,found) => {
        if(err){
            console.log(err);
        }else{
            var use = {name : "Admin"};
            res.render("courtcases",{currentUser: use, caseNow: found});
        }
    })
    }else{
        res.redirect("/");
    }
});



app.get("/:id/lawcases",(req, res) => {
    
    Lawyer.findById(req.params.id,(err,found)=>{
        Case.find({"lawyer.name" : found.name},(err,foundCase)=>{
            console.log(foundCase);
            res.render("seecases",{caseNow: foundCase, currentUser: found.name});
        });
    });
});

app.get("/:id/lawcasedetails",(req,res)=>{
    Case.findById(req.params.id,(err,found)=>{
        res.render("lawyercasedisplay",{currentUser: null , caseNow: found, users: JSON.stringify(found.author),lawyers: JSON.stringify(found.lawyer)});
        
    });
});

app.post("/:id/accept",(req,res)=>{
    PendingCase.findById(req.params.id,(err,found)=>{
        if(err){
            console.log(err);
        }else{
            Lawyer.findById(found.lawyer.id,(err,foundLawyer)=>{
                var lw = {
                    name : foundLawyer.name ,
                    uid : foundLawyer.uid
                };
                var casenew = new Case({
                    name : found.name,
                    type : found.type ,
                    description : found.description ,
                    createdAt : found.createdAt ,
                    author : found.author,
                    lawyer : lw ,
                    mobile: "7550145401",
                    firsthearing : null,
                    nexthearing : null,
                    status : null,
                    comment : null,
                    courtno : null,
                    judge : null
                });
                Case.create(casenew,(err,insertedCase)=>{
                    if(err){
                        console.log(err)
                    }else{
                        PendingCase.findByIdAndDelete(req.params.id,(err,deleted)=>{
                            if(err){
                                console.log(err);
                            }else{
                                res.redirect("/" + foundLawyer._id + "/lawdashboard");
                            }
                        });
                        
                    }
                });
            });
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

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            // Store hash in your password DB.
            var addr = req.body.address + " ," + req.body.city + " = " + req.body.pincode + req.body.state ;  
            var newLawyer = new Lawyer({username : req.body.username ,
                 name:req.body.name,
                  email:req.body.email,
                   mobile:req.body.mobile, 
                   dob:req.body.dob,
                   address : addr,
                   gender: req.body.gender,
                   uid : req.body.uid,
                   qualification : req.body.qualification,
                   password: hash
                }) ;

                Lawyer.create(newLawyer, function(err , client){
                    if(err){
                        console.log(err);
                        res.redirect("/");
                    }
                    res.redirect("/");
                    console.log(newLawyer);
                });
        });
    });
    
    // newClient.img.data = fs.readFileSync(req.body.image);
    // newClient.img.contentType = 'image/png';
    
});

app.get("/:id/lawdashboard",(req,res) =>{
    Lawyer.findById(req.params.id,(err,found) =>{
        res.render("lawdashboard",{currentUser: found,lawyerNow: found});
    });
    
});

app.post("/lawlogin",(req,res) =>{

    Lawyer.find({username: req.body.lawusername},(err,found) => {
        if(err){
            console.log(err)
        }else{
            if(Array.isArray(found) && found.length){
            console.log(found);
            console.log("Passsss : " + req.body.lawpassword);
            console.log("Hasshhhh : " + found[0].password);
            bcrypt.compare(req.body.lawpassword, found[0].password, function(err, ress) {
                if(ress === true){
                    res.redirect("/" + found[0]._id + "/lawdashboard");
                }else{
                    console.log(err);
                    res.redirect("/lawregister");
                }
            });
        }else{
            res.redirect("/lawregister");
        }
        }
        
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


//Mobile App Routes


app.get("/mobile",(req,res)=>{
    res.send("Hi");
});


app.post("/mobile/login", (req,res,next)=>{
    passport.authenticate("local", function(err,user,info){

        if(err){
            console.log("Inside Mobile Post Error : " + err);
        }else {
            console.log("Inside Mobile Post : " + user);
            res.status(200).send({ user1: user });

            // req.logIn(user, function(err) {
            //     if (err) { console.log("Inside Mobile Post Error1 : " + err);
            //     }else{
            //         console.log("Logged In Sucessfully : ");
            //     }
                
            //   });
        }
})(req, res, next);
    // res.send("OKKK");
}
);

module.exports = app;