const basicModel = require('./index.js');

class liveCommentModel extends basicModel {
  constructor(props = "live_comments") {
    super(props);
  }
}

module.exports = new liveCommentModel();