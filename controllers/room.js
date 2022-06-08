// Controller handler to handle functionality in room page

const roomGenerator = require("../util/roomIdGenerator.js");
const Room = require("../models/Rooms");
// Example for handle a get request at '/:roomId' endpoint.

function getRoom(request, response) {
//   console.log(response);
//     response.render("room", {
//       title: "chatroom",
//       roomName: request.params.roomName,
//       newRoomId: roomGenerator.roomIdGenerator(),
//     });
    Room.find()
      .lean()
      .then((items) => {
        response.render("room", {
          title: "chatroom",
          roomId: request.params.roomName,
          roomObjID: request.params._id,
          newRoomId: roomGenerator.roomIdGenerator(),
          rooms: items,
        });
      });
}

module.exports = {
  getRoom,
};
