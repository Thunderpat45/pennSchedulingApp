const express = require('express');
const router = express.Router();


//change to authentication functionality
router.get('/', function(req, res, next) {
    res.render('logIn', {
        layout: "./layouts/logInLayout"
    })
})

router.post('/logIn', function(req,res,next){

})

module.exports = router;