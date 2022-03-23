const express = require('express');
const adminUserRouter = express.Router({mergeParams:true});

const adminUsersController = require('../controllers/adminUsersController');

function authenticator(req, res, next){
    if(req.isAuthenticated()){
      return next()
    }else{
      res.redirect('/')
    }
  }

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
adminUserRouter.get(':userId/:season/adminHome/schedule', adminUsersController.getSchedule);


module.exports = adminUserRouter;