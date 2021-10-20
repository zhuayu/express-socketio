const JwtMiddleware = require('./middlewares/jwt');
const campLiveRoomMessageHandlers = require('./www/campLiveRoomMessageHandlers');

module.exports = (app) => {
  const io = require('socket.io')(app.server, require('../conf/socketio'));
  app.set('socketio', io);

  io.of('/www')
    .use(JwtMiddleware)
    .on("connection", socket => {
      campLiveRoomMessageHandlers(io, socket, '/www');
    });
}