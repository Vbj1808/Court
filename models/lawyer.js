var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var LawyerSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    dob: Date,
    mobile: Number,
    email: String,
    uid:String
});

LawyerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Lawyer", LawyerSchema);