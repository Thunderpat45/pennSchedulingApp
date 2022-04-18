const express = require('express');
const userRouter = express.Router({mergeParams:true});

const usersController = require('../controllers/usersController');


userRouter.use(authorizeUser)
userRouter.use(validateInputs)

//main page general functions
userRouter.get('/', usersController.getHome);
userRouter.get('/userData', usersController.getUserDataAll)

//single team data changes
userRouter.post('/team', usersController.postTeamCreation);
userRouter.put('/team/:teamId', usersController.postTeamUpdate);
userRouter.delete('/team/:teamId', usersController.postTeamDelete);
userRouter.patch('/team/:teamId/verification', usersController.postTeamVerify);

//multi team data changes
userRouter.patch('/allTeamsVerification', usersController.postAllTeamsVerified)
userRouter.patch('/allTeamsOrder', usersController.postMyTeamsOrder);

//availablity data changes

userRouter.post('/timeBlock' ,usersController.postTimeBlockCreation);
userRouter.put('/timeBlock/:timeBlockId', usersController.postTimeBlockUpdate);
userRouter.delete('/timeBlock/:timeBlockId', usersController.postTimeBlockDelete);


function authorizeUser(req, res, next){
    const {userId, season} = req.params
    const sessionId = req.session.passport.user._id

    if(req.isAuthenticated() && userId == sessionId){
        return next()
    }else{
        res.redirect(`/user/${sessionId}/${season}/home`)
    }
}

function validateInputs(req, res, next){
    const testRegex = /[^A-Za-z0-9]/;
    const {userId, season} = req.params
    const sessionId = req.session.passport.user._id

    if(testRegex.test(userId) || testRegex.test(season)){
        res.redirect(`/user/${sessionId}/fall/home`)
    }else{
        return next()
    }
}

module.exports = userRouter;
