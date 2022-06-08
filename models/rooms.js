const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const MessageSchema = new Schema({
//   userName: {
//     type: String,
//     required: true,
//   },
//   message: {
//     type: String,
//     required: true,
//   },
// });

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  message: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    },
  ],
  //messages: MessageSchema,
  //[

  // {
  //   userName: {
  //     type: String,
  //     required: true,
  //   },
  //   message: {
  //     type: String,
  //     required: true,
  //   },
  // },
  // ],
});

module.exports = Item = mongoose.model("room", RoomSchema);
