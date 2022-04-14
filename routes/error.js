const express = require('express');
const router = express.Router();

router.get('/error', function(req, res, next) {
    res.status(404)
    res.render('error', {
        layout: "./layouts/errorLayout",
        error: null
    })
})

module.exports = router;