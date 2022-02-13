const express = require('express');
const router = express.Router();


const availabilityController = require('../controllers/availabilityController');
const mainController = require('../controllers/mainController');
const teamController = require('../controllers/teamController');
const userController = require('../controllers/userController');

//add something to prevent ANYTHING UNTIL LOG IN

//main page general functions
router.get('/:id/:season/home', mainController.getHome);
router.get('/:id/:season/adminHome', mainController.getAdminHome);
router.get('/:id/:season/adminHome/adminData.json', mainController.getAdminDataAll);

//something for logOuts

//single team data changes
router.post(':id/:season/home/team/create', teamController.postTeamCreation);
router.post(':id/:season/home/team/:id/update', teamController.postTeamUpdate);
router.post(':id/:season/home/team/:id/verify', teamController.postTeamVerify);
router.post(':id/:season/home/team/:id/delete', teamController.postTeamDelete);
router.post(':id/:season/adminHome/team/:id/enableChange', teamController.postTeamEnableChange);

//multi team data changes
router.post('id:/:season/home/postAllTeamsVerified', mainController.postAllUserTeamsVerified) //not actually seasonally dependent
router.post(':id/:season/home/postMyTeamsOrder', mainController.postMyTeamsOrder);
router.post(':id/:season/adminHome/postAllTeamsOrder', mainController.postAllTeamsOrder);

//availablity data changes

router.post(':id/:season/home/availability:id/update', availabilityController.postAvailabilityEdit);
router.post(':id/:season/adminHome/postAdminTimeBlocks', mainController.postAdminTimeBlocks);

//user data changes, none of these are seasonally dependent

router.post('/:id/:season/adminHome/user/add.json', userController.postUserCreation);
router.post('/:id/:season/adminHome/user/:id/update.json', userController.postUserUpdate);
router.post(':id/:season/adminHome/user/:id/delete', userController.postUserDelete);

//other

router.post('/:id/:season/adminHome/postAdminFacilitySettings.json', mainController.postAdminFacilitySettings);
router.get(':id/:season/adminHome/getSchedule', mainController.getSchedule);











router.get('/')

module.exports = router;
