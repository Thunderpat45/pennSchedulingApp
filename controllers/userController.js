const user = require('../models/userModel');


const userControllerFunctions = {

    getUserCreation: function(req,res, next){ //userDependent
        res.send('NOT IMPLEMENTED: Get User Creation');
    },

    postUserCreation: function(req,res, next){ //userDependent
        res.send('NOT IMPLEMENTED: Post User Creation');
    },

    getUserUpdate: function(req,res, next){ //userDependent
        res.send('NOT IMPLEMENTED: Get User Update');
    },

    postUserUpdate: function(req,res, next){ //userDependent
        res.send('NOT IMPLEMENTED: Post User Update');
    },

    postUserDelete:function(req,res, next){ //userDependent
        res.send('NOT IMPLEMENTED: Post User Delete');
    }

}

module.exports = userControllerFunctions;
