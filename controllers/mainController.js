const team = require('../models/teamModel');
const facilitySettings = require('../models/facilitySettingsModel');
const user = require('../models/userModel');
const availability = require('../models/availabilityModel');

const userMainControllerFunctions = {

    logOut: function(req,res, next){ //move to another module?
        res.send('NOT IMPLEMENTED: Log Out Functionality');
    },

    getHome: function(req,res, next){ //userDependent, seasonal! should act on cancel buttons too
        res.send('NOT IMPLEMENTED: Get Homepage');
    },

    postAllUserTeamsVerified: function(req,res, next){ //userDependent
        res.send('NOT IMPLEMENTED: Post All User Teams Verified');
    },

    postMyTeamsOrder: function(req,res, next){ // userDependent, seasonal!
        res.send('NOT IMPLEMENTED: Post My Teams Order');
    },

    getAdminHome: function(req,res, next){ //userDependent, seasonal!, should act on cancel buttons too
        res.send('NOT IMPLEMENTED: Get Admin Homepage');
    },

    postAdminFacilitySettings:function(req,res, next){ //userDependent
        res.send('NOT IMPLEMENTED: Post Admin Facility Settings');
    },

    postAdminTimeBlocks:function(req,res, next){ //userDependent, seasonal!
        res.send('NOT IMPLEMENTED: Post Admin Time Blocks');
    },

    postAllTeamsOrder:function(req,res, next){ 
        res.send('NOT IMPLEMENTED: Post All Teams Order');
    },

    getSchedule:function(req,res, next){ 
        res.send('NOT IMPLEMENTED: Get Schedule');
    },


}

module.exports = userMainControllerFunctions;