const basicModel = require('./index.js');

class userModel extends basicModel {
  constructor(props = "users") {
    super(props);
  }
}

module.exports = new userModel();
