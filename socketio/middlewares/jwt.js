const JWT = require('jsonwebtoken');
const roomPrefix = require('./../roomPrefix');

module.exports = (socket,next) => {
  const token = socket.handshake.auth?.token;
  if(!token) {
    next(new Error("miss token"));
    return;
  }

  try{

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const userId = decoded.sub;
    // const userId = socket.handshake.auth.id;
    // socket.userId = userId;
    socket.name = socket.handshake.auth.name;
    socket.join(roomPrefix.user(userId));
    next();
  } catch (e) {
    socket.disconnect();
    next(new Error(e.message));
  }
}