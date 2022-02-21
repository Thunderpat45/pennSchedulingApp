const availability = require('../models/availabilityModel');
const facilitySettings = require('../models/facilitySettingsModel')


const availabilityControllerFunctions = {

    getAvailabilityEdit: function(req,res, next){ // userDependent, seasonal!
        res.send('NOT IMPLEMENTED: Get Availablity Edit');
    },

    postAvailabilityEdit: function(req,res, next){ // userDependent, seasonal!
        res.send('NOT IMPLEMENTED: Post Availablity Edit');
    },

    postAdminTimeBlockCreation: async function(req, res, next){
        try{
            const errorArray = [];
            const blockData = req.body;
            const facilityData = await facilitySettings.find({});
            const timeBlocks = availability.find({$and: [{day: blockData.day}, {$or:[{'availability.startTime': blockData.availability.startTime},{'availability.endTime': blockData.availability.endTime}]}]}, 'day availability');

            
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
            const newBlock = new availability(blockData);
            await newBlock.save();
            res.json(newBlock._id);
        }catch(err){
            res.json(err)
        }
    },

    postAdminTimeBlockUpdate: async function(req,res, next){ //userDependent, seasonal!
        try{
            const errorArray = [];
            const blockData = req.body;
            const facilityData = await facilitySettings.find({});
            const timeBlocks = availability.find({$and: [{day: blockData.day}, {$or:[{'availability.startTime': blockData.availability.startTime},{'availability.endTime': blockData.availability.endTime}]}]}, 'day availability');

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
            await availability.findOneAndReplace({_id: blockData._id}, blockData)
            res.send("Literally anything")
        }catch(err){
            res.json(err)
        }
    },

    postAdminTimeBlockDelete: async function(req, res, next){
        try{
            const blockId = req.body;
            await availability.deleteOne({_id: blockId})
            res.send('Literally anything')
        }catch(err){
            res.status(400);
            res.json(err);
        }
    },
}

module.exports = availabilityControllerFunctions;