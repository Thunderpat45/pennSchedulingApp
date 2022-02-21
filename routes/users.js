const express = require('express');
const router = express.Router();


const availabilityController = require('../controllers/availabilityController');
const mainController = require('../controllers/mainController');
const teamController = require('../controllers/teamController');
const userController = require('../controllers/userController');

//add something to prevent ANYTHING UNTIL LOG IN

//main page general functions
router.get('/:userId/:season/home', mainController.getHome);
router.get('/:userId/:season/adminHome', mainController.getAdminHome);
router.get('/:userId/:season/adminHome/adminData.json', mainController.getAdminDataAll);
router.get('/:userId/:season/home/userData.json', mainController.getUserDataAll)

//something for logOuts

//single team data changes
router.post(':userId/:season/home/team/create', teamController.postTeamCreation);
router.post(':userId/:season/home/team/:teamId/update', teamController.postTeamUpdate);
router.post(':userId/:season/home/team/:teamId/verify', teamController.postTeamVerify);
router.post(':userId/:season/home/team/:teamId/delete', teamController.postTeamDelete);
router.post(':userId/:season/adminHome/team/:teamId/enableChange', teamController.postTeamEnableChange);

//multi team data changes
router.post(':userId:/:season/home/postAllTeamsVerified', mainController.postAllUserTeamsVerified) //not actually seasonally dependent
router.post(':userId/:season/home/postMyTeamsOrder', mainController.postMyTeamsOrder);
router.post(':userId/:season/adminHome/postAllTeamsOrder', mainController.postAllTeamsOrder);

//availablity data changes

router.post(':userId/:season/home/availability:availabilityId/update', availabilityController.postAvailabilityEdit);
router.post('/:userId/:season/adminHome/timeBlock/add.json', availabilityController.postAdminTimeBlockCreation)
router.post('/:userId/:season/adminHome/timeBlock/:timeBlockId/update.json', availabilityController.postAdminTimeBlockUpdate);
router.post('/:userId/:season/adminHome/timeBlock/:timeBlockId/delete.json', availabilityController.postAdminTimeBlockDelete)

//user data changes, none of these are seasonally dependent

router.post('/:userId/:season/adminHome/user/add.json', userController.postUserCreation);
router.post('/:userId/:season/adminHome/user/:modifyUserId/update.json', userController.postUserUpdate);
router.post('/:userId/:season/adminHome/user/:modifyUserId/delete.json', userController.postUserDelete);

//other

router.post('/:userId/:season/adminHome/postAdminFacilitySettings.json', mainController.postAdminFacilitySettings);
router.get(':userId/:season/adminHome/getSchedule', mainController.getSchedule);











router.get('/')

module.exports = router;
