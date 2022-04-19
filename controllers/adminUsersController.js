const timeConverter = require('../timeConverterExpress.js');

const team = require('../models/teamModel');
const facilitySettings = require('../models/facilitySettingsModel');
const user = require('../models/userModel');
const availabilities = require('../models/availabilityModel');
const buildTeamsSchedule = require('../masterScheduleAlgorithm').buildTeamsSchedule;
const buildExcelSchedules = require('../excelBuilder').buildExcelSchedules
const bcrypt = require('bcryptjs')
const adminBlockDebug = require('debug')('adminTimeBlock');
const userDebug = require('debug')('user');
const adminTeamDebug = require('debug')('adminTeam');
const facilitySettingsDebug = require('debug')('facilitySettings');
const adminHomePageDebug = require('debug')('adminHomePage')
const schedulerDebug = require('debug')('scheduler')

adminBlockDebug.enabled = true
userDebug.enabled = true
adminTeamDebug.enabled = true
facilitySettingsDebug.enabled = true
adminHomePageDebug.enabled = true
schedulerDebug.enabled = true

const testRegex = /[^A-Za-z0-9]/
const stringRegex = /[^A-Za-z]/
const numberRegex = /[^0-9]/
const passwordRegex = /[[\](){}]/

const adminControllerFunctions = {
    
    postAdminTimeBlockCreation: async function(req, res, next){
        try{
            const {season} = req.params
            const errorArray = [];
            if(season != 'fall' && season != 'spring'){
                errorArray.push('Invalid data request')
            }
            const blockData = req.body;
            const facilityData = await facilitySettings.find({});

            const reqValidation = testAvailabilityData(facilityData, blockData) 

            if(reqValidation != undefined){
                errorArray.push(reqValidation)
            }

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
            adminBlockDebug(err)
            res.status(400)
            res.json(err)
        }
    },

    postAdminTimeBlockUpdate: async function(req,res, next){
        
        try{
            const {season} = req.params
            const errorArray = [];
            if(season != 'fall' && season != 'spring'){
                errorArray.push('Invalid data request')
            }
            const blockData = req.body;
            const facilityData = await facilitySettings.find({});

            const reqValidation = testAvailabilityData(facilityData, blockData) 

            if(reqValidation != undefined){
                errorArray.push(reqValidation)
            }

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
            adminBlockDebug(err)
            res.status(400)
            res.json(err)
        }
    },

    postAdminTimeBlockDelete: async function(req, res, next){
        try{
            const blockId = req.body;
            const errorArray = []

            if(!Object.hasOwnProperty.call(blockId, '_id')){
                errorArray.push('Invalid request data')
            }
            for(let prop in blockId){
                if(prop != '_id'){ 
                    errorArray.push('Invalid request data')
                }
            }

            if(blockId._id.length > 40 || typeof blockId._id != 'string' || testRegex.test(blockId._id)){
                errorArray.push('Invalid request data')
            }

            if(errorArray.length >0){
                errorArray.push(errorArray)
            }

            await availabilities.deleteOne({_id: blockId})
            res.send('Literally anything')
        }catch(err){
            adminBlockDebug(err)
            res.status(400);
            res.json(err);
        }
    },

    postTeamEnabledChange:async function(req,res, next){
        const {_id} = req.body;
        const errorArray = []

        try{
            if(_id.length > 40 || typeof _id != 'string' || testRegex.test(_id)){
                errorArray.push('Invalid request data')
            }

            if(errorArray.length >0){
                throw(errorArray)
            }
            const thisTeam = await team.findById(_id);
            thisTeam.enabled = !thisTeam.enabled;
            await thisTeam.save();

            res.send('Literally anything')
        }catch(err){
            adminTeamDebug(err)
            res.status(400);
            res.json(err);
        }
    },

    postUserCreation: async function(req,res, next){
        try{
            const thisUser = req.body
            const errorArray = []

            thisUser.password = await bcrypt.hash(thisUser.password, 10);
            
            const reqValidation = testUserData(thisUser)

            if(reqValidation != undefined){
                errorArray.push(reqValidation)
            }  
    
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
            userDebug(err);
            res.status(400)
            res.json(err)
        }
    },

    postUserUpdate: async function(req,res, next){
        try{
            const thisUser = req.body;
            const thisId = req.params.modifyUserId
            const errorArray = []

            if(thisUser.password){
                thisUser.password = await bcrypt.hash(thisUser.password, 10);
            }

            if(testRegex.test(thisId)){
                errorArray.push('Invalid data request')
            }

            const reqValidation = testUserData(thisUser)

            if(reqValidation != undefined){
                errorArray.push(reqValidation)
            }  
    
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
            userDebug(err);
            res.status(400);
            res.json(err);
        }
    },

    postUserDelete:async function(req,res, next){
        try{
            const targetUserId = req.body;
            const targetId = req.params.modifyUserId;
            const {userId, season} = req.params
            const errorArray = []

            if((season != 'fall' && season!= 'spring') || testRegex.test(userId) || testRegex.test(targetId) || typeof targetUserId != 'object'){
                errorArray.push('Invalid data request')
            }
    
            const data = await Promise.all([user.find({$or: [{_id: targetUserId._id}, {privilegeLevel: true}]}, 'privilegeLevel'), user.findOne({_id: targetUserId._id}, 'privilegeLevel')])
            const [users, thisUser] = data

            const privilegeLevelError = users.filter(function(user){
                return user.privilegeLevel == true && user._id != targetUserId._id;
            })

            if(thisUser.privilegeLevel != true && privilegeLevelError.length == 0){
                const string = "Cannot delete last admin. Create new admin users before demoting this admin.";
                errorArray.push(string);
            }

            if(errorArray.length > 0){
                throw (errorArray)
            }else{
                await Promise.all([user.deleteOne({_id: targetId}), team.deleteMany({coach: targetUserId._id}), availabilities.deleteMany({coach: targetUserId._id})])
                const teams = await Promise.all([team.find({season:'fall'}).sort({'rank.allTeams':1}), team.find({season:'spring'}).sort({'rank.allTeams':1})])
                
                const [fallTeams, springTeams] = teams ;
                
                await Promise.all(
                    fallTeams.map(async function(thisTeam, index){
                        thisTeam.rank.allTeams = index;
                        await thisTeam.save()
                }), 
                    springTeams.map(async function(thisTeam, index){
                        thisTeam.rank.allTeams = index;
                        await thisTeam.save()
                }))

                res.status(303)
                res.json({userId: userId, season: season})
            }
        }catch(err){
            userDebug(err);
            res.status(400);
            res.json(err);
        }  
    },

    
    getAdminHome: async function(req,res, next){ 
        try{
            const {season, userId} = req.params

            if((season != 'fall' && season != 'spring') || testRegex.test(userId)){
                throw('Invalid data request')
            }
            const adminData = await Promise.all([facilitySettings.findById('6202a107cfebcecf4ca9aecd'), user.find({}, '_id privilegeLevel color lastVerified name'),
                user.findById(userId, '_id privilegeLevel color lastVerified'), availabilities.find({admin: true, season: season}), team.find({season: season}).populate('coach').sort({'rank.allTeams':1})
            ]);
            
            const [facilityData, users, thisUser, adminAvailability, teams]= adminData
            const adminTimeBlocks = sortAvailabilities(adminAvailability);
            const data = {facilityData, users, adminTimeBlocks, season, thisUser, teams}

            renderAdminHome(data)
        }catch(err){
            adminHomePageDebug(err)
            res.redirect(`./error`)
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
    
    getAdminDataAll: async function(req,res,next){
        
        try{
            const {season} = req.params;
            if(season != 'fall' && season != 'spring'){
                throw('Invalid data request')
            }

            const adminData = await Promise.all([facilitySettings.findById('6202a107cfebcecf4ca9aecd'), user.find({}, '_id privilegeLevel color lastVerified name'),
            availabilities.find({admin: true, season: season}), team.find({season: season}).populate('coach').sort({'rank.allTeams':1})
        ]);
        
            const [facilityData, allUsers, adminAvailability, teams]= adminData
            const adminTimeBlocks = sortAvailabilities(adminAvailability)
            const data = {facilityData, allUsers, adminTimeBlocks, season, teams}

            res.json(data);
        }catch(err){
            adminHomePageDebug(err);
            res.status(400);
            res.json(err);
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

    
    postAdminFacilitySettings: async function(req,res, next){
        try{
            const facilityData = req.body;
            const errorArray = []
            const reqValidation = testFacilityData(facilityData)
            if(reqValidation != undefined){
                errorArray.push('Invalid data type')
            }
            if(errorArray.length > 0){
                throw errorArray
            }
            await facilitySettings.findOneAndReplace({_id: facilityData._id}, facilityData)
            res.send("Literally anything")
        }catch(err){
            facilitySettingsDebug(err);
            res.status(400);
            res.json(err);
        }
    },
    
    postAllTeamsOrder: async function(req,res, next){ 
        try{  
            const allTeams = req.body;

            if(!Array.isArray(allTeams) || allTeams.length == 0){
                throw('Invalid request data')
            }

            allTeams.forEach(function(team){
                if(typeof team != 'object' || !Object.hasOwnProperty.call(team, 'rank') || typeof team.rank != 'object' || !Object.hasOwnProperty.call(team.rank, 'allTeams') || typeof team.rank.allTeams != 'number'){
                    throw('Invalid request data')
                }
            })
            await Promise.all(allTeams.map(async function(teams){
                await team.findByIdAndUpdate(teams._id, {'rank.allTeams': teams.rank.allTeams})
            }))

            res.json('Literally anything')


            
        }catch(err){
            adminTeamDebug(err);
            res.status(400);
            res.json(err);
        }
    },

    getSchedule: async function(req,res, next){ 
        try{
            const {season} = req.params;

            if(season != 'fall' && season != 'spring'){
                throw('Invalid data request')
            }
            
            const data = await Promise.all([user.find({}, 'name').lean(), team.find({season: season, enabled:true}, 'name coach enabled size rank allOpts').sort('rank.allTeams').populate({path:'coach', select:'name color -_id'}).lean(),
                facilitySettings.findOne().lean(), availabilities.find({season: season}, 'admin day availability coach').populate({path: 'coach', select: 'name -_id'}).lean()
            ]);

            const [allUsers, allTeams, facilityData, allAvailabilities]= data
            
            allTeams.forEach(function(team){
                team.color = team.coach.color
            })
            facilityData.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

            const templateData = {facilityData, allAvailabilities, allUsers}
            const scheduleData = buildTeamsSchedule(allTeams, templateData)

            if(scheduleData.completedSchedules){
                scheduleData.completedSchedules[0].forEach(function(team){
                    if(team.size == 150){
                        team.size = 6;
                    }else{
                        team.size = Math.ceil(team.size/25)
                    }
                })
            }else{
                scheduleData.longestStack.forEach(function(team){
                    if(team.size == 150){
                        team.size = 6;
                    }else{
                        team.size = Math.ceil(team.size/25)
                    }
                }) 
            }

            const sheets = buildExcelSchedules(scheduleData, facilityData)

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "schedules.xlsx"
            );
            
            await sheets.xlsx.write(res);
            
            res.end();

            
        }catch(err){
            schedulerDebug(err);
            res.status(400);
            res.json(err);
        }
    },
}

function testUserData(userData){
    if(!Object.hasOwnProperty.call(userData, 'name') || !Object.hasOwnProperty.call(userData, 'color') ||
    !Object.hasOwnProperty.call(userData, 'privilegeLevel')|| 
    !Object.hasOwnProperty.call(userData, 'lastVerified')){
        console.log('missing prop')
        throw('Invalid request data')
    }

    for(let prop in userData){
        switch(prop){
            case 'name':
                if(testRegex.test(userData[prop]) || userData[prop].length > 30 || typeof userData[prop] != 'string'){
                    console.log('name error')
                    throw('Invalid data request')
                }
                break;
            case 'color':
                if(typeof userData[prop] != 'string' || userData[prop].length != 7){
                    console.log('color error')
                    throw('Invalid data request')
                }
                break;
            case 'privilegeLevel':
                if(typeof userData[prop] != 'boolean' ){
                    console.log('bad privilege')
                    throw('Invalid data request')
                }
                break;
            case 'teams':
                if(!Array.isArray(userData[prop])){
                    console.log('teams not array')
                    throw('Invalid data request')
                }
                userData[prop].forEach(function(team){
                    if(typeof team != 'string' ||testRegex.test(team)){
                        console.log('bad team id')
                        throw('Invalid data request')
                    }
                })
                break;
            case 'availability':
                if(typeof userData[prop] != 'object'){
                    console.log('availability not object')
                    throw('Invalid data request')
                }
                for (let subprop in userData[prop]){
                    if(!Array.isArray(userData[prop][subprop]) || subprop.length != 3 || stringRegex.test(subprop)){

                        console.log('availability prop not day')
                        throw('Invalid data request')
                    }
                    userData[prop][subprop].forEach(function(availability){
                        if(typeof availability != 'string' || testRegex.test(availability)){
                            console.log('bad avail id')
                            throw('Invalid data request')
                        }
                    })
                }
                break;
            case 'lastVerified':
                if((typeof userData[prop]!= 'string' && userData[prop] != null )||(typeof userData[prop] == 'string' && (numberRegex.test(userData[prop])&& userData[prop].search('-') == -1))){
                    console.log('verification error')
                    throw('Invalid data request')
                }
                break;
            case '__v':
                if(typeof userData[prop]!= 'number'){
                    console.log('bad version')
                    throw('Invalid request data')
                }
                break;
            case '_id':
                if(typeof userData[prop] != 'string' || testRegex.test(userData[prop])){
                    console.log('bad id')
                    throw('Invalid data request')
                }
                break;
            case 'password':
                if(passwordRegex.test(userData[prop])){
                    console.log('bad password');
                    throw('Invalid data request')
                }
                break; //?
            default:
                console.log('extra prop')
                throw('Invalid data request')
        }
    }
}

function testFacilityData(facilityData){
    if(!Object.hasOwnProperty.call(facilityData, 'facilityClose') || !Object.hasOwnProperty.call(facilityData, 'facilityOpen') ||
    !Object.hasOwnProperty.call(facilityData, 'facilityMaxCapacity') || !Object.hasOwnProperty.call(facilityData, '_id')){
        throw('Invalid request data')
    }
    for(let prop in facilityData){
        switch(prop){
            case 'facilityOpen':
            case 'facilityClose':
                if(typeof facilityData[prop]!= 'number' || numberRegex.test(facilityData[prop]) || facilityData.facilityOpen >= facilityData.facilityClose){
                    throw('Invalid data request')
                }
                break;
            case '_id':
                if(typeof facilityData[prop] != 'string' || facilityData[prop].length > 40 || testRegex.test(facilityData[prop])){
                    throw('Invalid data request')
                }
                break;
            case 'facilityMaxCapacity':
                if(typeof facilityData[prop] != 'number'){
                    throw('Invalid data request')
                }
                break;
            default:
                throw('Invalid request data')
        }
    }
}

function testAvailabilityData(facilityData, availabilityData){
    

    if(!Object.hasOwnProperty.call(availabilityData, 'availability') || !Object.hasOwnProperty.call(availabilityData, 'admin') ||
    !Object.hasOwnProperty.call(availabilityData, 'season') || !Object.hasOwnProperty.call(availabilityData, 'day')){
        throw('Invalid request data')
    }
    for(let prop in availabilityData){
        switch(prop){
            case 'availability':
                if(typeof availabilityData[prop] != 'object' || !Object.hasOwnProperty.call(availabilityData[prop], 'startTime') || !Object.hasOwnProperty.call(availabilityData[prop], 'endTime') || 
                availabilityData[prop].startTime < facilityData.facilityOpen || availabilityData[prop].startTime > facilityData.facilityClose || 
                availabilityData[prop].endTime <= facilityData.facilityOpen || availabilityData[prop].endTime > facilityData.facilityClose ||
                numberRegex.test(availabilityData[prop].startTime) || numberRegex.test(availabilityData[prop].endTime)){
                    throw('Invalid data request')
                }
                break;
            case '_id':
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


module.exports = adminControllerFunctions 