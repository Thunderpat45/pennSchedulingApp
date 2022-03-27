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
    try{ 
        if(!Object.hasOwnProperty.call(req.body, 'username') || !Object.hasOwnProperty.call(req.body, 'password')){
            throw('Invalid request content')
        }
        for(let prop in req.body){
            if(prop != 'username' & prop!= 'password'){
                throw('Invalid request content')
            }
        }
        const {username, password} = req.body;
        const testRegex = /[^A-Za-z0-9]/;
        if(testRegex.test(username) || typeof username != 'string' || username.length > 30 ||username.length ==0|| testRegex.test(password) || typeof password != 'string' || password.length> 30 || password.length ==0){
            throw('Invalid username/password combination')
        }
        const thisUser = await user.findOne({name: username});

        passport.authenticate('local', {
            failureRedirect: '/',
        }, function(err,user){
            if(err){
                console.log(err)
                return next(err)
            }else if(!user){
                console.log('Oops!')
                const error = 'Invalid username/password combination.'
                console.log(error)
                return res.render('logIn', {
                    layout: "./layouts/logInLayout",
                    error:error
                })
            }else{
                req.logIn(user, function(err){
                    if(err){
                        return next(err)
                    }
                    return res.redirect(`/user/${thisUser._id}/fall/home`)
                })   
            }
        })(req, res, next)
        
    }catch(err){
        console.log(err)
        res.render('logIn', {
            layout: "./layouts/logInLayout",
            error:err
        })
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