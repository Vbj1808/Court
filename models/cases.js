var mongoose = require("mongoose");

var caseSchema = new mongoose.Schema({
   name: String,
   type: String,
   description: String,
   lawyer: String,
   createdAt: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Client"
      },
      name: String
   }
});

module.exports = mongoose.model("Case", caseSchema);