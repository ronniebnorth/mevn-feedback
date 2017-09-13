var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
  email: String,
  message: String
});

var Feedback = mongoose.model("Feedback", FeedbackSchema);
module.exports = Feedback;
