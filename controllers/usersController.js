const timeConverter = require('../timeConverterExpress.js');

const team = require('../models/teamModel');
const facilitySettings = require('../models/facilitySettingsModel');
const user = require('../models/userModel');
const availabilities = require('../models/availabilityModel');

const userControllerFunctions = {

    postTimeBlockCreation: async function(req, res, next){
        const {userId, season} = req.params
        try{
            const errorArray = [];
            const blockData = req.body;
            const facilityData = await facilitySettings.find({});
            const timeBlocks = await availabilities.find({$and: [{coach: userId}, {day: blockData.day}, {season:season},
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
                errorArray.push('Overlap with another time block on the same day.')
            }
            if(blockData.availability.startTime < facilityData.facilityOpen || blockData.availability.startTime > facilityData.facilityClose){
                errorArray.push("Start time requested is currently outside facility hours. Speak to supervisor about facility hours changes")
            }else if(blockData.availability.endTime < facilityData.facilityOpen || blockData.availability.endTime > facilityData.facilityClose){
                errorArray.push("End time requested is currently outside facility hours. Speak to supervisor about facility hours changes")
            }

            if(errorArray.length > 0){
                throw(errorArray)
            }
            blockData.coach = userId;
            const newBlock = new availabilities(blockData);
            const savedBlock = await newBlock.save();

            await user.findByIdAndUpdate(userId, {$push:{[`availability.${savedBlock.day}`]: savedBlock._id }})

            res.json(newBlock._id);
        }catch(err){
            res.status(400)
            res.json(err)
        }
    },

    postTimeBlockUpdate: async function(req,res, next){ //userDependent, seasonal!
        const {userId, season} = req.params
        try{
            const errorArray = [];
            const blockData = req.body;
            const facilityData = await facilitySettings.find({});
            const timeBlocks = await availabilities.find({$and: [{coach: userId}, {day: blockData.day}, {season:season},
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
                errorArray.push('Overlap with another time block on the same day.')
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
            res.status(400)
            res.json(err)
        }
    },

    postTimeBlockDelete: async function(req, res, next){
        try{
            const userId = req.params.userId
            const blockData = req.body;
            await availabilities.deleteOne({_id: blockData._id})
            await user.findByIdAndUpdate(userId, {$pull:{[`availability.${blockData.day}`]: blockData._id }})
            res.send('Literally anything')
        }catch(err){
            res.status(400);
            res.json(err);
        }
    },

    postTeamCreation: async function(req,res, next){  //userDependent, seasonal!
        try{
            const thisUser = req.params.userId
            const thisTeam = req.body;
            const errorArray = [];

            const thisUserAllTeams = await team.find({coach: thisUser})
            const allTeams = await team.find();
            const teams = await team.find({name: thisTeam.name}, 'name coach');

            const nameMatchError = teams.filter(function(team){
                return team.name == thisTeam.name && team._id != thisTeam._id
            })

            if(nameMatchError.length > 0){
                const string = `Data already exists for ${thisTeam.name}. Use another team name or discuss with owning coach.`;
                errorArray.push(string);
            }

            if(errorArray.length > 0){
                throw (errorArray)
            }else{
                thisTeam.rank.myTeams = thisUserAllTeams.length;
                thisTeam.rank.allTeams = allTeams.length
                const newTeam = new team(thisTeam)
                const savedTeam = await newTeam.save();

                await user.findByIdAndUpdate(savedTeam.coach, {$push:{'teams': savedTeam._id }})

                res.json(newTeam._id);
            }
            

        }catch(err){
            console.log(err);
            res.status(400)
            res.json(err)
        }
    },

    postTeamUpdate: async function(req,res, next){ //userDependent, seasonal!
        try{
            const thisTeam = req.body;
            const errorArray = [];

            const teams = await team.find({name: thisTeam.name}, 'name coach');

            const nameMatchError = teams.filter(function(team){
                return (team.name == thisTeam.name|| team._id != thisTeam._id) && team.coach != thisTeam.coach;
            })

            if(nameMatchError.length > 0){
                const string = `Data already exists for ${thisTeam.name} under another coach. Use another team name or discuss with owning coach.`;
                errorArray.push(string);
            }

            if(errorArray.length > 0){
                throw (errorArray)
            }else{
            
                await team.findOneAndReplace({_id: thisTeam._id}, thisTeam);
                res.send('literally anything');
            }
            

        }catch(err){
            console.log(err);
            res.status(400)
            res.json(err)
        }
    },

    postTeamDelete: async function(req,res, next){ //userDependent, seasonal!
        const userId = req.params.userId
        const teamId = req.body._id;

        try{
            await team.deleteOne({_id: teamId})
            await user.findByIdAndUpdate(userId, {$pull:{[`teams`]: teamId}})
            res.send('Literally anything')
        }catch(err){
            console.log(err)
            res.status(400);
            res.json(err);
        }
    },

    postTeamVerify: async function(req,res, next){ //userDependent, seasonal!
        const {_id, lastVerified} = req.body;
        try{
            console.log(req.isAuthenticated())
            await team.findByIdAndUpdate(_id, {lastVerified: lastVerified})
            res.send('Literally anything')
        }catch(err){
            console.log(err)
            res.status(400);
            res.json(err);
        }
    },

    getHome: async function(req,res, next){ //userDependent, seasonal! should act on cancel buttons too
        const {userId, season} = req.params
        try{
            console.log(req.isAuthenticated())
            const facilityData = await facilitySettings.findById('6202a107cfebcecf4ca9aecd');
            const availabilityData = await availabilities.find({$and:[{$or:[{coach: userId}, {admin:true}]},{season:season}]})
            const availabilityTimeBlocks = sortAvailabilities(availabilityData);
            const thisUser = await user.findOne({_id: userId});
            const myTeams = await team.find({$and:[{season:season}, {coach: userId}]}).sort({"rank.myTeams":1})

            const data = {thisUser, facilityData, season, availabilityTimeBlocks, myTeams}

            renderHomePage(data);
        }catch(err){
            console.log(err)
            res.redirect()//
        }
        
        function renderHomePage(data){
            const {name, privilegeLevel, lastVerified, /*availabilityTimeBlocks,*/} = data.thisUser;
            res.render('home', {
                name: name,
                privilegeLevel: privilegeLevel,
                layout: './layouts/homePagesLayout',
                timeConverter: timeConverter,
                season: data.season,
                lastVerified: lastVerified,
                availability: data.availabilityTimeBlocks,
                teams: data.myTeams,
                facilityData: data.facilityData
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

    postAllTeamsVerified: async function(req,res, next){ //userDependent
        const {userId} = req.params;
        const {lastVerified} = req.body
        try{
            await user.findByIdAndUpdate(userId, {lastVerified: lastVerified})
            res.send('Literally anything')
        }catch(err){
            console.log(err);
            res.status(400);
            res.json(err);
        }
    },

    postMyTeamsOrder: async function(req,res, next){ // userDependent, seasonal!
        try{
            const myTeams = req.body;
            await Promise.all(myTeams.map(async function(teams){
                await team.findByIdAndUpdate(teams._id, {'rank.myTeams': teams.rank.myTeams})
            }))

            res.json('Literally anything')


            
        }catch(err){
            console.log(err);
            res.status(400);
            res.json(err);
        }
    },




    getUserDataAll: async function(req,res,next){
        const {userId, season} = req.params
        try{
            const thisUser = await user.findOne({_id: userId});
            const availabilityData = await availabilities.find({$and:[{$or:[{coach: userId}, {admin:true}]},{season:season}]})
            const facilityData = await facilitySettings.findById('6202a107cfebcecf4ca9aecd');
            const availabilityTimeBlocks = sortAvailabilities(availabilityData);
            const myTeams = await team.find({$and:[{season:season}, {coach: userId}]}).sort({"rank.myTeams":1})

            const data = {thisUser, availabilityTimeBlocks, facilityData, season, myTeams}
            res.json(data);
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

}

module.exports = userControllerFunctions