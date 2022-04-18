const express = require('express');
const adminUserRouter = express.Router({mergeParams:true});
const adminUsersController = require('../controllers/adminUsersController');


adminUserRouter.use(authorizeAdminUser)
adminUserRouter.use(validateInputs)

//main page general functions
adminUserRouter.get('/', adminUsersController.getAdminHome);
adminUserRouter.get('/adminData', adminUsersController.getAdminDataAll);

//single team data changes
adminUserRouter.patch('/team/:teamId/enabledStatus', adminUsersController.postTeamEnabledChange);

//multi team data changes

adminUserRouter.patch('/allTeamsOrder', adminUsersController.postAllTeamsOrder);

//availablity data changes

adminUserRouter.post('/timeBlock', adminUsersController.postAdminTimeBlockCreation)
adminUserRouter.put('/timeBlock/:timeBlockId', adminUsersController.postAdminTimeBlockUpdate);
adminUserRouter.delete('/timeBlock/:timeBlockId', adminUsersController.postAdminTimeBlockDelete)

//user data changes, none of these are seasonally dependent

adminUserRouter.post('/user', adminUsersController.postUserCreation);
adminUserRouter.put('/user/:modifyUserId', adminUsersController.postUserUpdate);
adminUserRouter.delete('/user/:modifyUserId', adminUsersController.postUserDelete);

//other

adminUserRouter.put('/facilitySettings', adminUsersController.postAdminFacilitySettings);
adminUserRouter.get('/schedule', adminUsersController.getSchedule);

function authorizeAdminUser(req, res, next){
    const {userId, season} = req.params
    const {_id, privilegeLevel} = req.session.passport.user

    if(req.isAuthenticated() && userId == _id && privilegeLevel == true){
        return next()
    }else{
        res.redirect(`/user/${_id}/${season}/home`)
    }
}

function validateInputs(req, res, next){
    const testRegex = /[^A-Za-z0-9]/;
    const {userId, season} = req.params
    const sessionId = req.session.passport.user._id

    if(testRegex.test(userId) || testRegex.test(season)){
        res.redirect(`/user/${sessionId}/fall/adminHome`)
    }else{
        return next()
    }
}

module.exports = adminUserRouter;