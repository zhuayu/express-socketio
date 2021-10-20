const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Socket.IO Demo' });
});

module.exports = router;
