const express = require('express');
const router = express.Router();


//change to authentication functionality
router.get('/', function(req, res, next) {
    res.render('logIn', {
        layout: "./layouts/logInLayout"
    })
})

module.exports = router;