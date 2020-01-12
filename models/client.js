var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var ClientSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    dob: Date,
    mobile: Number,
    email: String
});

ClientSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("Client", ClientSchema);