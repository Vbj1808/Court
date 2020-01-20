var mongoose = require("mongoose");

var pendingSchema = new mongoose.Schema({
   name: String,
   type: String,
   description: String,
   lawyer: {
    id: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Lawyer"
    },
    name: String
 },
   createdAt: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Client"
      },
      name: String
   }
   
});

module.exports = mongoose.model("PendingCase", pendingSchema);