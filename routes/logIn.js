const express = require('express');
const router = express.Router();
const passport = require('passport')

const user = require('../models/userModel');


//change to authentication functionality
router.get('/', function(req, res, next) {
    res.render('logIn', {
        layout: "./layouts/logInLayout",
        error: null
    })
})

router.post('/logIn', async function(req,res,next){
    const {username} = req.body;
    const thisUser = await user.findOne({name: username});
    
    try{ 
        passport.authenticate('local', {
            failureRedirect: '/',
        }, function(err,user){
            if(err){
                return next(err)
            }else if(!user){
                console.log('Oops!')
                const error = 'Invalid username/password combination.'
                return res.render('logIn', {
                    layout: "./layouts/logInLayout",
                    error:error
                })
            }else{
                req.logIn(user, function(err){
                    if(err){
                        return next(err)
                    }
                    console.log(req.isAuthenticated())
                    return res.redirect(`/user/${thisUser._id}/fall/home`)
                })   
            }
        })(req, res, next)
        
    }catch(err){
        console.log(err)
    }
})

router.get('/logOut',function(req, res, next) {
    req.logOut()
    res.render('logIn', {
        layout: "./layouts/logInLayout",
        error: null
    })
})

module.exports = router;