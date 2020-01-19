var mongoose = require("mongoose");

var LawyerSchema = new mongoose.Schema({
    username: String,
    password: { type : String, bcrypt : true } ,
    name: String,
    gender: String,
    dob: Date,
    qualification: String,
    mobile: Number,
    email: String,
    uid:String,
    address: String
});


module.exports = mongoose.model("Lawyer", LawyerSchema);