const roomPrefix = require('./roomPrefix');

module.exports = {
  checkUserInRoom: async (io, nameSpace, socketId, roomId, userId) => {
    const room = roomPrefix.live(roomId);
    const user = roomPrefix.user(userId);
    const roomSockets = await io.of(nameSpace).in(room).allSockets();
    const userSockets = await io.of(nameSpace).in(user).allSockets();
    let userHasIn = false;
    userSockets.forEach(socketItem => {
      if(socketItem !== socketId && roomSockets.has(socketItem)) {
        userHasIn = true;
      }
    });
    return userHasIn;
  }
}