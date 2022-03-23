const express = require('express');
const baseUserRouter = express.Router();

const userRouter = require('./users');
const adminUserRouter = require('./adminUsers')

baseUserRouter.use('/:userId/:season/home', userRouter);
baseUserRouter.use('/:userId/:season/adminHome', adminUserRouter)


module.exports = baseUserRouter;
