const roomPrefix = require('./../roomPrefix');

module.exports = (io, socket, nameSpace) => {

  const disconnect = (reason) => {
    const userId = socket.userId;
    socket.leave(roomPrefix.user(userId));
    console.log(`disconnect ${socket.id} due to ${reason}`);
  }

  const clientCampLiveRoomJoin = data => {
    const room = roomPrefix.live(data.room_id);
    socket.join(room);
  }

  const clientCampLiveRoomMessage = data => {
    const room = roomPrefix.live(data.room_id);
    io.of(nameSpace).to(room).emit('chat_message_update', data.value);
  }

  const clientCampLiveRoomLeave = data => {
    const room = roomPrefix.live(data.room_id);
    socket.leave(room);
  }

  // #todo check user first join
  // #todo check user last leave
  socket.on("CLIENT_CAMP_LIVE_ROOM_JOIN", clientCampLiveRoomJoin);
  socket.on("CLIENT_CAMP_LIVE_ROOM_MESSAGE", clientCampLiveRoomMessage);
  socket.on("CLIENT_CAMP_LIVE_ROOM_LEAVE", clientCampLiveRoomLeave);
  socket.on("disconnect", disconnect);
}