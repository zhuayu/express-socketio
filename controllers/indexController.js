const indexController = {
  index: function(req, res, next) {
    const io = req.app.get('socketio');
    const room = req.query.room;
    io.of('/www').to(room).emit('chat_message_update', 'haha');
    res.json({'message': 'success'});
  },
}

module.exports = indexController;