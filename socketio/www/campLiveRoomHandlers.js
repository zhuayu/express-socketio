const schema = require('async-validator').default;
const roomPrefix = require('./../roomPrefix');
const { checkUserInRoom } = require('./../utils');

module.exports = (io, socket, nameSpace) => {

  const clientCampLiveRoomJoin = async data => {
    const validator = new schema({
      room_id:  { type: 'number', required: true },
    });
    try{
      await validator.validate(data);
      const room = roomPrefix.live(data.room_id);
      socket.join(room);
      socket.campLiveRoomId = data.room_id;
      const userHasInRoom = await checkUserInRoom(io, nameSpace, socket.id, data.room_id, socket.userId);
      if(!userHasInRoom) {
        io.of(nameSpace).to(room).emit('SERVER_CAMP_LIVE_ROOM_JOIN', {
          user_id: socket.userId,
          name: socket.name,
        });
      }
    }catch(e) {
      socket.emit('UNPROCESSABLE_ENTITY', e.errors);
    }
  }

  const clientCampLiveRoomMessage = async data => {
    const validator = new schema({
      room_id:  { type: 'number', required: true },
      value:  { type: 'string', required: true },
    });

    try {
      await validator.validate(data);
      const room = roomPrefix.live(data.room_id);
      io.of(nameSpace).to(room).emit('CLIENT_CAMP_LIVE_ROOM_MESSAGE', {
        value: data.value,
        user_id: socket.userId,
        name: socket.name,
      });
    }catch(e) {
      socket.emit('UNPROCESSABLE_ENTITY', e.errors);
    }
  }

  const clientCampLiveRoomLeave = async() => {
    const userId = socket.userId;
    const roomId = socket.campLiveRoomId;
    const userHasInRoom = await checkUserInRoom(io, nameSpace, socket.id, roomId, userId);
    if(roomId && !userHasInRoom) {
      io.of(nameSpace)
        .to(roomPrefix.live(roomId))
        .emit('SERVER_CAMP_LIVE_ROOM_LEAVE', {
        user_id: socket.userId,
        name: socket.name,
      });
    }
  }

  const disconnect = async (reason) => {
    const userId = socket.userId;
    const roomId = socket.campLiveRoomId;
    if(roomId) {
      await clientCampLiveRoomLeave();
    }
    console.log(`disconnect ${socket.id} due to ${reason}`);
  }

  socket.on("CLIENT_CAMP_LIVE_ROOM_JOIN", clientCampLiveRoomJoin);
  socket.on("CLIENT_CAMP_LIVE_ROOM_MESSAGE", clientCampLiveRoomMessage);
  socket.on("CLIENT_CAMP_LIVE_ROOM_LEAVE", clientCampLiveRoomLeave);
  socket.on("disconnect", disconnect);
}