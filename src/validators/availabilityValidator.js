import { events } from "../events";

const availabilityValidator = (function(){
  
    events.subscribe("adminBlockDataValidationRequested", validateAllAdminAvailability);
    events.subscribe("availabilityValidationRequested", validateAllUserAvailability);
    
    function validateAllAdminAvailability(timeBlockData){
        const {timeBlock, origin} = timeBlockData
        const errorArray = []
        validateAllInputs(timeBlock, errorArray)
        
        if(errorArray.length == 0){
            events.publish("adminAvailabilityDataValidated", timeBlockData)
        }else{
            events.publish("adminAvailabilityDataValidationFailed", {errors: errorArray, origin})
        }
    }
    
    function validateAllUserAvailability(timeBlockData){
        const {timeBlock, origin} = timeBlockData
        const errorArray = []
        validateAllInputs(timeBlock, errorArray)

        if(errorArray.length == 0){
            events.publish("userAvailabilityDataValidated",timeBlockData);
        }else{
            events.publish("userAvailabilityValidationFailed", {errors: errorArray, origin})
        }
    }
    
    function validateAllInputs(timeBlock, array){
        try{
            for(let prop in timeBlock.availability){
                if(timeBlock.availability[prop] == "default"){
                    throw(`Value for ${prop} cannot be default`);
                }
            }

            if(timeBlock.availability.startTime >= timeBlock.availability.endTime){
                throw('Start time overlaps with end time!')
            }
        }catch(err){
            array.push(err)
        }
    }
})()

export {availabilityValidator}