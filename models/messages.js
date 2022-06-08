const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  datetime : {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    required: true,
  },

});
module.exports = Item = mongoose.model("messages", MessageSchema);
