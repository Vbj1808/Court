var mongoose = require("mongoose");

var caseSchema = new mongoose.Schema({
   name: String,
   type: String,
   description: String,
   lawyer: {name : String, uid: String},
   createdAt: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Client"
      },
      name: String
   },
   firsthearing : Date,
   nexthearing : Date,
   status : String,
   comment : String,
   courtno : String,
   judge : String
});

module.exports = mongoose.model("Case", caseSchema);