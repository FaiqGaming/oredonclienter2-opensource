const mongoose = require('mongoose');

const blacklist = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: String,
  userID: String,
  time: String,
  type: Boolean
})
module.exports = mongoose.model("Test", blacklist);