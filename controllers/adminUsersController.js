const timeConverter = require('../timeConverterExpress.js');

const team = require('../models/teamModel');
const facilitySettings = require('../models/facilitySettingsModel');
const user = require('../models/userModel');
const availabilities = require('../models/availabilityModel');

const adminControllerFunctions = {
    
    postAdminTimeBlockCreation: async function(req, res, next){
        const {season} = req.params
        try{
            const errorArray = [];
            const blockData = req.body;
            const facilityData = await facilitySettings.find({});

            testAvailabilityData(facilityData, blockData)

            const timeBlocks = await availabilities.find({$and: [{admin: true},{day: blockData.day}, {season:season},
                {$or:[
                    {$and:[
                        {'availability.startTime': {$lte: blockData.availability.startTime}}, 
                        {$and:[{'availability.endTime': {$gt: blockData.availability.startTime}}, {'availability.endTime': {$lte: blockData.availability.endTime}}]}]},
                    {$and:[
                        {'availability.endTime': {$gt: blockData.availability.endTime}}, 
                        {$and:[{'availability.startTime': {$gt: blockData.availability.startTime}}, {'availability.startTime': {$lt: blockData.availability.endTime}}]}]},
                    {$and:[
                        {$and: [{'availability.startTime': {$gte: blockData.availability.startTime}}, {'availability.startTime': {$lt:blockData.availability.endTime}}]}, 
                        {$and: [{'availability.endTime': {$gt: blockData.availability.startTime}}, {'availability.endTime': {$lte:blockData.availability.endTime}}]}
                ]}]}]},
                        'day availability');

            
            if(timeBlocks.length>0){
                errorArray.push('Overlap with another admin time block on the same day.')
            }
            if(blockData.availability.startTime < facilityData.facilityOpen || blockData.availability.startTime > facilityData.facilityClose){
                errorArray.push("Start time requested is currently outside facility hours. Speak to supervisor about facility hours changes")
            }else if(blockData.availability.endTime < facilityData.facilityOpen || blockData.availability.endTime > facilityData.facilityClose){
                errorArray.push("End time requested is currently outside facility hours. Speak to supervisor about facility hours changes")
            }

            if(errorArray.length > 0){
                throw(errorArray)
            }
            const newBlock = new availabilities(blockData);
            await newBlock.save();
            res.json(newBlock._id);
        }catch(err){
            console.log(err)
            res.status(400)
            res.json(err)
        }
    },

    postAdminTimeBlockUpdate: async function(req,res, next){ //userDependent, seasonal!
        const {season} = req.params
        try{
            const errorArray = [];
            const blockData = req.body;
            const facilityData = await facilitySettings.find({});

            testAvailabilityData(facilityData, blockData)

            const timeBlocks = await availabilities.find({$and: [{_id: {$ne: blockData._id}}, {day: blockData.day}, {season:season},
                {$or:[
                    {$and:[
                        {'availability.startTime': {$lte: blockData.availability.startTime}}, 
                        {$and:[{'availability.endTime': {$gt: blockData.availability.startTime}}, {'availability.endTime': {$lte: blockData.availability.endTime}}]}]},
                    {$and:[
                        {'availability.endTime': {$gt: blockData.availability.endTime}}, 
                        {$and:[{'availability.startTime': {$gt: blockData.availability.startTime}}, {'availability.startTime': {$lt: blockData.availability.endTime}}]}]},
                    {$and:[
                        {$and: [{'availability.startTime': {$gte: blockData.availability.startTime}}, {'availability.startTime': {$lt:blockData.availability.endTime}}]}, 
                        {$and: [{'availability.endTime': {$gt: blockData.availability.startTime}}, {'availability.endTime': {$lte:blockData.availability.endTime}}]}
                ]}]}]},
                        'day availability');

            if(timeBlocks.length>0){
                errorArray.push('Overlap with another admin time block on the same day.')
            }
            if(blockData.availability.startTime < facilityData.facilityOpen || blockData.availability.startTime > facilityData.facilityClose){
                errorArray.push("Start time requested is currently outside facility hours. Speak to supervisor about facility hours changes")
            }else if(blockData.availability.endTime < facilityData.facilityOpen || blockData.availability.endTime > facilityData.facilityClose){
                errorArray.push("End time requested is currently outside facility hours. Speak to supervisor about facility hours changes")
            }

            if(errorArray.length > 0){
                throw(errorArray)
            }
            await availabilities.findOneAndReplace({_id: blockData._id}, blockData)
            res.send("Literally anything")
        }catch(err){
            console.log(err)
            res.status(400)
            res.json(err)
        }
    },

    postAdminTimeBlockDelete: async function(req, res, next){
        try{
            const blockId = req.body;
            await availabilities.deleteOne({_id: blockId})
            res.send('Literally anything')
        }catch(err){
            res.status(400);
            res.json(err);
        }
    },

    postTeamEnabledChange:async function(req,res, next){ //should this be two functions? userDependent, seasonal!
        const {_id} = req.body;
        try{
            const thisTeam = await team.findById(_id);
            thisTeam.enabled = !thisTeam.enabled;
            await thisTeam.save();
            res.send('Literally anything')
        }catch(err){
            console.log(err)
            res.status(400);
            res.json(err);
        }
    },

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
            const thisUser = req.body;
            const thisId = req.params.modifyUserId
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
                const update = {name: thisUser.name, privilegeLevel: thisUser.privilegeLevel, color: thisUser.color}
                await user.findOneAndUpdate({_id: thisId}, update);
                res.send("Literally anything");
            }

            
        }catch(err){
            console.log(err);
            res.status(400);
            res.json(err);
        }
    },

    postUserDelete:async function(req,res, next){ //userDependent
        try{
            const thisUser = req.body;
            const thisId = req.params.modifyUserId;
            const errorArray = []
    
            const users = await user.find({$or: [{_id: thisUser._id}, {privilegeLevel: true}]}, 'privilegeLevel');
            const privilegeLevelError = users.filter(function(user){
                return user.privilegeLevel == true && user._id != thisUser._id;
            })

            if(thisUser.privilegeLevel != true && privilegeLevelError.length == 0){
                const string = "Cannot delete last admin. Create new admin users before demoting this admin.";
                errorArray.push(string);
            }

            if(errorArray.length > 0){
                throw (errorArray)
            }else{
                await user.deleteOne({_id: thisId});
                res.send("Literally anything");
            }
        }catch(err){
            console.log(err);
            res.status(400);
            res.json(err);
        }  
    },

    
    getAdminHome: async function(req,res, next){ //userDependent, seasonal!, should act on cancel buttons too
        try{
            const {season, userId} = req.params
            const facilityData = await facilitySettings.findById('6202a107cfebcecf4ca9aecd');
            const users = await user.find();
            const thisUser = await user.findById(userId)
            const adminAvailability = await availabilities.find({admin: true, season: season})
            const adminTimeBlocks = sortAvailabilities(adminAvailability);
            const teams = await team.find({season: season}).populate('coach').sort({'rank.allTeams':1})
            const data = {facilityData, users, adminTimeBlocks, season, thisUser, teams}
          
            renderAdminHome(data)
        }catch(err){
            console.log(err)
            res.redirect() //some error page
        }
      
        function renderAdminHome(data){
            res.render('adminHome', { 
                layout: './layouts/homePagesLayout',
                timeConverter: timeConverter,
                privilegeLevel: data.thisUser.privilegeLevel, 
                season: data.season,
                allTeams: data.teams,
                facilityData: data.facilityData,
                facilityRawData:{
                    open:{
                        start: 240,
                        end: 1200,
                        increment: 15
                    },
                    close:{
                        start: 300,
                        end: 1260,
                        increment: 15
                    },
                    maxCapacity:{
                        start: 10,
                        end: 150,
                        increment: 5
                    }
                },
            
                allUsers: data.users,
                adminTimeBlocks: data.adminTimeBlocks
            })
        }

        function sortAvailabilities(availabilityData){
            const availabilityObject = {
                Sun: [],
                Mon: [],
                Tue: [],
                Wed: [],
                Thu: [],
                Fri: [],
                Sat: [],
            }
    
            availabilityData.forEach(function(availability){
                availabilityObject[availability.day].push(availability)
            })
    
            for(let day in availabilityObject){
                availabilityObject[day].sort(function(a,b,){
                    return a.availability.startTime - b.availability.startTime
                })
            }
    
            return availabilityObject
        }
        
    },
    
    getAdminDataAll: async function(req,res,next){//userDependent
        
        try{
            const {season} = req.params;
            const facilityData = await facilitySettings.findOne(); //turn this into a promise.all
            const allUsers = await user.find();
            const adminAvailability = await availabilities.find({admin: true, season: season})
            const adminTimeBlocks = sortAvailabilities(adminAvailability)
            const teams = await team.find({season: season}).populate('coach').sort({'rank.allTeams':1})
            const adminData = {facilityData, allUsers, adminTimeBlocks, season, teams}
            res.json(adminData);
        }catch(err){
            console.log(err)
        }

       function sortAvailabilities(availabilityData){
            const availabilityObject = {
                Sun: [],
                Mon: [],
                Tue: [],
                Wed: [],
                Thu: [],
                Fri: [],
                Sat: [],
            }
    
            availabilityData.forEach(function(availability){
                availabilityObject[availability.day].push(availability)
            })
    
            for(let day in availabilityObject){
                availabilityObject[day].sort(function(a,b,){
                    return a.availability.startTime - b.availability.startTime
                })
            }
    
            return availabilityObject
        }
    },

    
    postAdminFacilitySettings: async function(req,res, next){ //userDependent
        try{
            const facilityData = req.body;
            await facilitySettings.findOneAndReplace({_id: facilityData._id}, facilityData)
            res.send("Literally anything")
        }catch(err){
            res.send(err)
        }
    },
    
    postAllTeamsOrder: async function(req,res, next){ 
        try{
            const allTeams = req.body;
            await Promise.all(allTeams.map(async function(teams){
                await team.findByIdAndUpdate(teams._id, {'rank.allTeams': teams.rank.allTeams})
            }))

            res.json('Literally anything')


            
        }catch(err){
            console.log(err);
            res.status(400);
            res.json(err);
        }
    },

    getSchedule:function(req,res, next){ 
        res.send('NOT IMPLEMENTED: Get Schedule');
    },
}

function testAvailabilityData(facilityData, availabilityData){
    const testRegex = /[^A-Za-z0-9]/
    const stringRegex = /[^A-Za-z]/
    const numberRegex = /[^0-9]/

    if(!Object.hasOwnProperty.call(availabilityData, 'availability') || !Object.hasOwnProperty.call(availabilityData, 'admin') ||
    !Object.hasOwnProperty.call(availabilityData, 'season') || !Object.hasOwnProperty.call(availabilityData, 'day')){
        console.log('what the hey?')
        throw('Invalid request data')
    }
    for(let prop in availabilityData){
        switch(prop){
            case 'availability':
                if(typeof availabilityData[prop] != 'object' || !Object.hasOwnProperty.call(availabilityData[prop], 'startTime') || !Object.hasOwnProperty.call(availabilityData[prop], 'endTime') || 
                typeof availabilityData[prop].startTime != 'string' || typeof availabilityData[prop].endTime != 'string' || availabilityData[prop].startTime < facilityData.facilityOpen || 
                availabilityData[prop].startTime > facilityData.facilityClose || availabilityData[prop].endTime <= facilityData.facilityOpen || availabilityData[prop].endTime > facilityData.facilityClose ||
                numberRegex.test(availabilityData[prop].startTime) || numberRegex.test(availabilityData[prop].endTime)){
                    console.log(availabilityData[prop])
                    throw('Invalid data request')
                }
                break;
            case '_id':
                if(typeof availabilityData[prop] != 'string' || availabilityData[prop].length > 40 || testRegex.test(availabilityData[prop])){
                    console.log(availabilityData[prop])
                    throw('Invalid data request')
                }
                break;
            case 'admin':
                if(typeof availabilityData[prop] != 'boolean'){
                    console.log(availabilityData[prop])
                    throw('Invalid data request')
                }
                break;
            case 'season':
                if(availabilityData[prop] != 'fall' && availabilityData[prop]!= 'spring'){
                    console.log(availabilityData[prop])
                    throw('Invalid data request')
                }
                break;
            case 'day':
                if(typeof availabilityData[prop]!= 'string' || availabilityData[prop].length != 3 || stringRegex.test(availabilityData[prop])){
                    console.log(availabilityData[prop])
                    throw('Invalid data request')
                }
                break;
            case '__v':
                if(typeof availabilityData[prop]!= 'number'){
                    throw('Invalid request data')
                }
                break;
            default:
                throw('Invalid request data')
        }
    }
}


module.exports = adminControllerFunctions 