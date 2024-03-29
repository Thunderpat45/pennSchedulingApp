const timeConverter = require('../timeConverterExpress.js');

const team = require('../models/teamModel');
const facilitySettings = require('../models/facilitySettingsModel');
const user = require('../models/userModel');
const availabilities = require('../models/availabilityModel');
const teamDebug = require('debug')('team');
const availabilityDebug = require('debug')('availability')
const homePageDebug = require('debug')('homePage')

teamDebug.enabled = true
availabilityDebug.enabled = true;
homePageDebug.enabled= true;

const testRegex = /[^A-Za-z0-9]/
const stringRegex = /[^A-Za-z]/
const numberRegex = /[^0-9]/

const userControllerFunctions = {

    postTimeBlockCreation: async function(req, res, next){
        const {userId, season} = req.params
        try{
            const errorArray = [];
            if((season != 'fall' && season != 'spring') || testRegex.test(userId)){
                errorArray.push('Invalid data request')
            }
            const blockData = req.body;

            const facilityData = await facilitySettings.find({});
            
            const reqValidation = testAvailabilityData(facilityData, blockData)
            if(reqValidation != undefined){
                errorArray.push(reqValidation)
            }

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
            availabilityDebug(err)
            res.status(400)
            res.json(err)
        }
    },

    postTimeBlockUpdate: async function(req,res, next){
        const {userId, season, timeBlockId} = req.params
        try{
            const errorArray = [];
            if((season != 'spring' && season != 'fall') || testRegex.test(userId) || testRegex.test(timeBlockId)){
                errorArray.push('Invalid data request')
            }
            const blockData = req.body;
            const facilityData = await facilitySettings.find({});

            const reqValidation = testAvailabilityData(facilityData, blockData)
            if(reqValidation != undefined){
                errorArray.push(reqValidation)
            }

            const timeBlocks = await availabilities.find({$and: [{_id: {$ne: timeBlockId}},{coach: userId}, {day: blockData.day}, {season:season},
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
            availabilityDebug(err)
            res.status(400)
            res.json(err)
        }
    },

    postTimeBlockDelete: async function(req, res, next){
        try{
            const errorArray = [];
            const userId = req.params.userId
            const blockData = req.body;
            if(testRegex.test(userId)){
                errorArray.push('Invalid data request')
            }
            if(!Object.hasOwnProperty.call(blockData, 'day') || !Object.hasOwnProperty.call(blockData, '_id')){
                errorArray.push('Invalid request data')
            }
            for(let prop in blockData){
                if(prop != 'day' && prop != '_id'){ 
                    errorArray.push('Invalid request data')
                }
            }

            if(blockData.day.length != 3 || typeof blockData.day != 'string' || stringRegex.test(blockData.day) || blockData._id.length > 40 || typeof blockData._id != 'string' || testRegex.test(blockData._id)){
                errorArray.push('Invalid request data')
            }

            if(errorArray.length > 0){
                throw errorArray
            }
            await Promise.all([availabilities.deleteOne({_id: blockData._id}), user.findByIdAndUpdate(userId, {$pull:{[`availability.${blockData.day}`]: blockData._id }})])
            res.send('Literally anything')
        }catch(err){
            availabilityDebug(err)
            res.status(400);
            res.json(err);
        }
    },

    postTeamCreation: async function(req,res, next){
        try{
            const errorArray = [];
            const thisUser = req.params.userId
            const season = req.params.season
            const thisTeam = req.body;

            const reqValidation = testTeamData(thisTeam)
            if(reqValidation!= undefined){
                errorArray.push(reqValidation)
            }

            if(testRegex.test(thisUser) || (season != 'fall' && season !='spring')){
                errorArray.push('Invalid data request')
            }

            const teamsData = await Promise.all([team.find({coach: thisUser}), team.find(), team.find({name: thisTeam.name, season: season}, 'name coach')])
            const [thisUserAllTeams, allTeams, teams] = teamsData

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

                res.json({_id: newTeam._id, rank: thisTeam.rank});
            }
            

        }catch(err){
            teamDebug(err);
            res.status(400)
            res.json(err)
        }
    },

    postTeamUpdate: async function(req,res, next){
        try{
            const thisTeam = req.body;
            const {season} = req.params
            const errorArray = [];
            
            if(season != 'fall' && season!= 'spring'){
                errorArray.push('Invalid data request')
            }

            const reqValidation = testTeamData(thisTeam)
            if(reqValidation!= undefined){
                errorArray.push(reqValidation)
            }

            const teams = await team.find({name: thisTeam.name, season: season}, 'name coach');

            const nameMatchError = teams.filter(function(team){
                return (team.name == thisTeam.name && team.coach != thisTeam.coach) || team._id != thisTeam._id;
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
            teamDebug(err);
            res.status(400)
            res.json(err)
        }
    },

    postTeamDelete: async function(req,res, next){
        const {userId,season} = req.params
        const teamId = req.body._id;

        try{
            if((season != 'fall' && season!= 'spring') || testRegex.test(userId) || testRegex.test(teamId)){
                throw('Invalid data request')
            }

            const teamsData = await Promise.all([team.find({season:season, coach: userId}), team.deleteOne({_id: teamId}), user.findByIdAndUpdate(userId, {$pull:{[`teams`]: teamId}})])
            
            const teams = teamsData[0]

            await Promise.all(teams.map(async function(thisTeam){
                await team.findByIdAndUpdate(thisTeam._id, {'rank.myTeams': thisTeam.rank.myTeams})
            }))
        
            res.status(303)
            res.json({userId: userId, season: season})
        }catch(err){
            teamDebug(err)
            res.status(400);
            res.json(err);
        }
    },

    postTeamVerify: async function(req,res, next){
        const {_id, lastVerified} = req.body;

        try{
            if(typeof lastVerified != 'string' || lastVerified.length > 100 || (testRegex.test(lastVerified) && lastVerified.indexOf('-') == -1) || testRegex.test(_id)){
                throw('Invalid request data')
            }
            await team.findByIdAndUpdate(_id, {lastVerified: lastVerified})
            res.send('Literally anything')
        }catch(err){
            teamDebug(err)
            res.status(400);
            res.json(err);
        }
    },

    postAllTeamsVerified: async function(req,res, next){
        const {userId} = req.params;
        const {lastVerified} = req.body

        
        try{
            if(typeof lastVerified != 'string' || lastVerified.length > 100 || (testRegex.test(lastVerified) && lastVerified.indexOf('-') == -1) || testRegex.test(userId)){
                throw('Invalid request data')
            }
            await user.findByIdAndUpdate(userId, {lastVerified: lastVerified})
            res.send('Literally anything')
        }catch(err){
            teamDebug(err);
            res.status(400);
            res.json(err);
        }
    },

    postMyTeamsOrder: async function(req,res, next){
        try{
            const myTeams = req.body;

            if(!Array.isArray(myTeams) || myTeams.length == 0){
                throw('Invalid request data')
            }

            myTeams.forEach(function(team){
                if(typeof team != 'object' || !Object.hasOwnProperty.call(team, 'rank') || typeof team.rank != 'object' || !Object.hasOwnProperty.call(team.rank, 'myTeams') || typeof team.rank.myTeams != 'number'){
                    throw('Invalid request data')
                }
            })

            await Promise.all(myTeams.map(async function(teams){
                await team.findByIdAndUpdate(teams._id, {"rank.myTeams": teams.rank.myTeams})
            }))

            res.json('Literally anything')

        }catch(err){
            teamDebug(err);
            res.status(400);
            res.json(err);
        }
    },

    getHome: async function(req,res, next){
        const {userId, season} = req.params
        try{
            if((season != 'fall' && season !='spring') || testRegex.test(userId)){
                throw('Invalid data request')
            }
            
            const homeData = await Promise.all([facilitySettings.findById('6202a107cfebcecf4ca9aecd'), availabilities.find({$and:[{$or:[{coach: userId}, {admin:true}]},{season:season}]}), 
                user.findOne({_id: userId}, 'availability _id name privilegeLevel color teams'), team.find({$and:[{season:season}, {coach: userId}]}).sort({"rank.myTeams":1})])
            
            const [facilityData, availabilityData, thisUser, myTeams] = homeData
            const availabilityTimeBlocks = sortAvailabilities(availabilityData);
            const data = {thisUser, facilityData, season, availabilityTimeBlocks, myTeams}

            renderHomePage(data);
        }catch(err){
            homePageDebug(err)
            res.redirect(`./error`);
        }
        
        function renderHomePage(data){
            const {name, privilegeLevel, lastVerified} = data.thisUser;
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

    getUserDataAll: async function(req,res,next){
        const {userId, season} = req.params

        try{
            if((season != 'fall' && season !='spring') || testRegex.test(userId)){
                throw('Invalid data request')
            }
            const homeData = await Promise.all([facilitySettings.findById('6202a107cfebcecf4ca9aecd'), availabilities.find({$and:[{$or:[{coach: userId}, {admin:true}]},{season:season}]}), 
                user.findOne({_id: userId}, 'availability _id name privilegeLevel color teams'), team.find({$and:[{season:season}, {coach: userId}]}).sort({"rank.myTeams":1})])
            
            const [facilityData, availabilityData, thisUser, myTeams] = homeData
            const availabilityTimeBlocks = sortAvailabilities(availabilityData);
            const data = {thisUser, facilityData, season, availabilityTimeBlocks, myTeams}

            res.json(data);
        }catch(err){
            homePageDebug(err)
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

function testTeamData(teamData){
    if(!Object.hasOwnProperty.call(teamData, 'name')||!Object.hasOwnProperty.call(teamData, 'season') ||
    !Object.hasOwnProperty.call(teamData, 'size') || !Object.hasOwnProperty.call(teamData, 'rank') || !Object.hasOwnProperty.call(teamData.rank, 'myTeams')|| 
    !Object.hasOwnProperty.call(teamData.rank, 'allTeams')||!Object.hasOwnProperty.call(teamData, 'coach') || !Object.hasOwnProperty.call(teamData, 'lastVerified') || 
    !Object.hasOwnProperty.call(teamData, 'enabled') || !Object.hasOwnProperty.call(teamData, 'allOpts')){
        console.log('missing prop')
        throw('Invalid request data')
    }

    for(let prop in teamData){
        switch(prop){
            case 'allOpts':
                if(!Array.isArray(teamData[prop]) || teamData[prop].length ==0){
                    console.log('allOpt none array')
                    throw('Invalid data request')
                }
                teamData[prop].forEach(function(option){
                    if(!Array.isArray(option) || option.length == 0){
                        console.log('bad option')
                        throw('Invalid data request')
                    }
                    option.forEach(function(day){
                        if(typeof day != 'object'){
                            console.log('bad day')
                            throw('Invalid data request')
                        }
                        for(let subprop in day){
                            switch(subprop){
                                case 'startTime':
                                case 'endTime':
                                    if(typeof day[subprop] != 'number' || day.startTime >= day.endTime || day[subprop].length <3 || day[subprop].length > 4 || numberRegex.test(day[subprop])){
                                        throw('Invalid data request')
                                    }
                                    break;
                                case 'dayOfWeek':
                                    if(day[subprop].length != 3 || typeof day[subprop] != 'string' || stringRegex.test(day[subprop])){
                                        console.log('bad day of Week')
                                        throw('Invalid data request')
                                    }
                                    break;
                                case 'inWeiss':
                                    if(day[subprop]!= 'yes' && day[subprop]!= 'no'){
                                        console.log('bad inWeiss')
                                        throw('Invalid data request')
                                    }
                                    break;
                                default:
                                    console.log('extra prop')
                                    throw('Invalid data request')
                            }
                        }
                    })
                })
                break;
            case '_id':
            case 'name':
            case 'coach':
                if(typeof teamData[prop] != 'string' || teamData[prop].length > 40 || testRegex.test(teamData[prop])){
                    console.log('id name or coach error')
                    throw('Invalid data request')
                }
                break;
            case 'enabled':
                if(typeof teamData[prop] != 'boolean'){
                    console.log('enabled error')
                    throw('Invalid data request')
                }
                break;
            case 'season':
                if(teamData[prop] != 'fall' && teamData[prop]!= 'spring'){
                    console.log('season error')
                    throw('Invalid data request')
                }
                break;
            case 'size':
                if(teamData[prop].length > 3 || teamData[prop] < 5||numberRegex.test(teamData[prop])){
                    console.log('size error')
                    throw('Invalid data request')
                }
                break;
            case 'lastVerified':
                if((typeof teamData[prop]!= 'string' && teamData[prop] != null )||(typeof teamData[prop] == 'string' && (numberRegex.test(teamData[prop])&& teamData[prop].search('-') == -1))){
                    console.log('verification error')
                    throw('Invalid data request')
                }
                break;
            case 'rank':
                if(typeof teamData[prop] != 'object'){

                    console.log('rank object error')
                    throw('Invalid data request')
                }for(let subprop in teamData[prop]){
                    switch(subprop){
                        case 'myTeams':
                        case 'allTeams':
                            if((typeof teamData[prop][subprop]!= 'number' && teamData[prop][subprop] != null ) || (typeof teamData[prop][subprop]== 'number' && teamData[prop][subprop]<0)){
                                console.log('myTeams/allTeams error')
                                throw('Invalid data request')
                            }
                            break;
                        default:
                            console.log('extra prop')
                            throw('Invalid data request');
                    }
                }
                    break;
            case '__v':
                if(typeof teamData[prop]!= 'number'){
                    console.log('bad version')
                    throw('Invalid request data')
                }
                break;
            default:
                console.log('extra prop')
                throw('Invalid request data')
        }
    }
}

function testAvailabilityData(facilityData, availabilityData){
   

    if(!Object.hasOwnProperty.call(availabilityData, 'availability')||!Object.hasOwnProperty.call(availabilityData, 'admin') ||
    !Object.hasOwnProperty.call(availabilityData, 'season') || !Object.hasOwnProperty.call(availabilityData, 'day')){
        throw('Invalid request data')
    }
    for(let prop in availabilityData){
        switch(prop){
            case 'availability':
                if(typeof availabilityData[prop] != 'object' || !Object.hasOwnProperty.call(availabilityData[prop], 'startTime') || !Object.hasOwnProperty.call(availabilityData[prop], 'endTime') || 
                typeof availabilityData[prop].startTime != 'number' || typeof availabilityData[prop].endTime != 'number' || availabilityData[prop].startTime < facilityData.facilityOpen || 
                availabilityData[prop].startTime > facilityData.facilityClose || availabilityData[prop].endTime <= facilityData.facilityOpen || availabilityData[prop].endTime > facilityData.facilityClose ||
                numberRegex.test(availabilityData[prop].startTime) || numberRegex.test(availabilityData[prop].endTime)){
                    throw('Invalid data request')
                }
                break;
            case '_id':
            case 'coach':
                if(typeof availabilityData[prop] != 'string' || availabilityData[prop].length > 40 || testRegex.test(availabilityData[prop])){
                    throw('Invalid data request')
                }
                break;
            case 'admin':
                if(typeof availabilityData[prop] != 'boolean'){
                    throw('Invalid data request')
                }
                break;
            case 'season':
                if(availabilityData[prop] != 'fall' && availabilityData[prop]!= 'spring'){
                    throw('Invalid data request')
                }
                break;
            case 'day':
                if(typeof availabilityData[prop]!= 'string' || availabilityData[prop].length != 3 || stringRegex.test(availabilityData[prop])){
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

module.exports = userControllerFunctions