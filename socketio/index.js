const JwtMiddleware = require('./middlewares/jwt');
const campLiveRoomHandlers = require('./www/campLiveRoomHandlers');

module.exports = (app) => {
  const io = require('socket.io')(app.server, require('../conf/socketio'));
  app.set('socketio', io);

  io.of('/www')
    .use(JwtMiddleware)
    .on("connection", socket => {
      campLiveRoomHandlers(io, socket, '/www');
    });
}