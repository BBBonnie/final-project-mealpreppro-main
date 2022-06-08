const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  
  PhoneNumber: {
    type: String,
    required: false,
  },
  age : {
    type: Number,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  Country: {
    type: String,
    required: false,
  },
  Region: {
    type: String,
    required: false,
  },


});
module.exports = Item = mongoose.model("user", UserSchema);
