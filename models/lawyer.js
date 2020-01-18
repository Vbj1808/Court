var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var LawyerSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    gender: String,
    dob: Date,
    qualification: String,
    mobile: Number,
    email: String,
    uid:String,
    address: String
});

LawyerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Lawyer", LawyerSchema);