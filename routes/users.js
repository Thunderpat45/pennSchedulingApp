const express = require('express');
const userRouter = express.Router({mergeParams:true});

const usersController = require('../controllers/usersController');

//main page general functions
userRouter.get('/', usersController.getHome);
userRouter.get('/userData', usersController.getUserDataAll)

//single team data changes
userRouter.post('/team', usersController.postTeamCreation);
userRouter.put('/team/:teamId', usersController.postTeamUpdate);
userRouter.delete('/team/:teamId', usersController.postTeamDelete);
userRouter.patch('/team/:teamId/verification', usersController.postTeamVerify);

//multi team data changes
userRouter.patch('/allTeamsVerification', usersController.postAllTeamsVerified) //not actually seasonally dependent
userRouter.patch('/allTeamsOrder', usersController.postMyTeamsOrder);

//availablity data changes

userRouter.post('/timeBlock' ,usersController.postTimeBlockCreation);
userRouter.patch('/timeBlock/:timeBlockId', usersController.postTimeBlockUpdate);
userRouter.delete('/timeBlock/:timeBlockId', usersController.postTimeBlockDelete);


module.exports = userRouter;
