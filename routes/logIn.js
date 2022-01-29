const express = require('express');
const router = express.Router();

//change to authentication functionality
router.get('/', function(req, res, next) {
  res.send('NOT IMPLEMENTED: Authentication and Login');
});

module.exports = router;
