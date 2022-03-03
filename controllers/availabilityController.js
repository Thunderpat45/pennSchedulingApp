const availabilities = require('../models/availabilityModel');
const user = require("../models/userModel")
const facilitySettings = require('../models/facilitySettingsModel')


const availabilityControllerFunctions = { //modify the errorArray to check all times within blocks, not jsut equal to start OR equal to end

    postTimeBlockCreation: async function(req, res, next){
        const {userId, season} = req.params
        try{
            const errorArray = [];
            const blockData = req.body;
            const facilityData = await facilitySettings.find({});
            const timeBlocks = await availabilities.find({$and: [{coach: userId}, {day: blockData.day}, {season:season}, //FIX THIS LOGIC
                {$or:[
                    {$and:[
                        {'availability.startTime': {$lte: blockData.availability.startTime}}, 
                        {$and:[{'availability.endTime': {$gte: blockData.availability.startTime}}, {'availability.endTime': {$lte: blockData.availability.endTime}}]}]},
                    {$and:[
                        {'availability.endTime': {$gte: blockData.availability.endTime}}, 
                        {$and:[{'availability.startTime': {$gte: blockData.availability.startTime}}, {'availability.endTime': {$lte: blockData.availability.endTime}}]}]}
                    ]}]},
                         'day availability');

                         
            console.log(timeBlocks)

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
            const timeBlocks = await availabilities.find({$and: [{coach: userId}, {day: blockData.day},{season:season}, {$or:[{'availability.startTime': blockData.availability.startTime},{'availability.endTime': blockData.availability.endTime}]}]}, 'day availability');

            console.log(timeBlocks)
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

    postAdminTimeBlockCreation: async function(req, res, next){
        const {season} = req.params
        try{
            const errorArray = [];
            const blockData = req.body;
            const facilityData = await facilitySettings.find({});
            const timeBlocks = await availabilities.find({$and: [{day: blockData.day}, {season:season}, {$or:[{'availability.startTime': blockData.availability.startTime},{'availability.endTime': blockData.availability.endTime}]}]}, 'day availability');

            
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
            const timeBlocks = await availabilities.find({$and: [{day: blockData.day}, {season:season}, {$or:[{'availability.startTime': blockData.availability.startTime},{'availability.endTime': blockData.availability.endTime}]}]}, 'day availability');

            console.log(timeBlocks)
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
}

module.exports = availabilityControllerFunctions;