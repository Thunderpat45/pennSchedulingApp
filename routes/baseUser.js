const express = require('express');
const baseUserRouter = express.Router();
const userRouter = require('./users');
const adminUserRouter = require('./adminUsers')

baseUserRouter.use(authenticator)
baseUserRouter.use('/:userId/:season/home', userRouter);
baseUserRouter.use('/:userId/:season/adminHome', adminUserRouter)

function authenticator(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }else{
        res.redirect('/')
    }
}

module.exports = baseUserRouter;


