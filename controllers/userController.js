const user = require('../models/userModel');
//find way to extract and abstract validation functions

const userControllerFunctions = {

    postUserCreation: async function(req,res, next){ //userDependent
        try{
            const thisUser = req.body
            const errorArray = []
    
            const users = await user.find({$or: [{name: thisUser.name}, {color: thisUser.color}]}, 'name color');
            const nameMatchError = users.filter(function(user){
                return user.name == thisUser.name
            })
            const colorMatchError = users.filter(function(user){
                return user.color == thisUser.color
            })

            if(nameMatchError.length > 0){
                const string = `Data already exists for ${thisUser.name}. Use another name or edit/delete the other user for the name you are trying to switch to.`;
                errorArray.push(string);
            }

            if(colorMatchError.length > 0){
                const string = `Another user is already using this color. Considering all the possible colors available, the odds are pretty low. Unlucky pick, I guess!`
                errorArray.push(string);
            }

            if(errorArray.length > 0){
                throw (errorArray)
            }else{
                const newUser = new user(thisUser)
                await newUser.save();
                res.json(newUser._id);
            }

            
        }catch(err){
            console.log(err);
            res.status(400)
            res.json(err)
        }
    },

    postUserUpdate: async function(req,res, next){ //userDependent
        try{
            const thisUser = req.body
            const errorArray = []
    
            const users = await user.find({$or: [{_id: thisUser._id}, {name: thisUser.name}, {privilegeLevel: true}, {color: thisUser.color}]}, 'name color privilegeLevel');
            const nameMatchError = users.filter(function(user){
                return user.name == thisUser.name && user._id != thisUser._id;
            })
            const colorMatchError = users.filter(function(user){
                return user.color == thisUser.color && user._id != thisUser._id;
            })
            const privilegeLevelError = users.filter(function(user){
                return user.privilegeLevel == true && user._id != thisUser._id;
            })

            if(nameMatchError.length > 0){
                const string = `Data already exists for ${thisUser.name}. Use another name or edit/delete the other user for the name you are trying to switch to.`;
                errorArray.push(string);
            }

            if(colorMatchError.length > 0){
                const string = `Another user is already using this color. Considering all the possible colors available, the odds are pretty low. Unlucky pick, I guess!`
                errorArray.push(string);
            }

            if(thisUser.privilegeLevel != true && privilegeLevelError.length == 0){
                const string = "Cannot demote last admin. Create new admin users before demoting this admin.";
                errorArray.push(string);
            }

            if(errorArray.length > 0){
                throw (errorArray)
            }else{
                await user.findOneAndReplace({_id: thisUser._id});
                res.send("Literally anything else")
            }

            
        }catch(err){
            console.log(err);
            res.status(400);
            res.json(err);
        }
    },

    postUserDelete:function(req,res, next){ //userDependent
        res.send('NOT IMPLEMENTED: Post User Delete');
    }

}

module.exports = userControllerFunctions;
