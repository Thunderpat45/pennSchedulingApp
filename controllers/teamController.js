const team = require('../models/teamModel');

const teamControllerFunctions = {

    getTeamCreation: function(req,res, next){ //userDependent, seasonal!
        res.send('NOT IMPLEMENTED: Get Team Creation');
    },
    
    postTeamCreation: function(req,res, next){  //userDependent, seasonal!
        res.send('NOT IMPLEMENTED: Post Team Creation');
    },

    getTeamUpdate: function(req,res, next){ //userDependent, seasonal!
        res.send('NOT IMPLEMENTED: Get Team Update');
    },

    postTeamUpdate:function(req,res, next){ //userDependent, seasonal!
        res.send('NOT IMPLEMENTED: Post Team Update');
    },

    postTeamDelete:function(req,res, next){ //userDependent, seasonal!
        res.send('NOT IMPLEMENTED: Post Team Delete');
    },

    postTeamVerify: function(req,res, next){ //userDependent, seasonal!
        res.send('NOT IMPLEMENTED: Post Team Verify');
    },

    postTeamEnableChange:function(req,res, next){ //should this be two functions? userDependent, seasonal!
        res.send('NOT IMPLEMENTED: Post Team Enable Change');
    },

}

module.exports = teamControllerFunctions;