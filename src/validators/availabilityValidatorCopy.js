import { events } from "../events";

/*purpose: validator for availabiity/adminAvailability updates

adminAvailbilityModel/availabilityModel is modeled as such:

    {
       day:[
           {startTime, endTime, admin},
           {startTime, endTime, admin}
       ],

       day:[etc]
    }, 

publishes:
    successful validations FOR adminMainPageAdminTimeBlockModel/availabiltyModel
   
subscribes to: 
    validation requests FROM adminMainPageAdminTimeBlockModel/availabiltyModel
*/

const availabilityValidator = (function(){
    // no obvious issues
    events.subscribe("adminAvailabilityValidationRequested", validateAllAdminAvailability);
    events.subscribe("userAvailabilityValidationRequested", validateAllUserAvailability);
    
    function validateAllAdminAvailability(timeBlockData){
        const validity = validateAllInputs(timeBlockData)
        if(validity == "No conflicts"){
            events.publish("adminAvailabilityDataValidated", timeBlockData)
        }else{
            events.publish("adminAvailabilityDataInvalidated", validity) //append this as list item
        }
    }
    
    function validateAllUserAvailability(timeBlockData){
        const validity = validateAllInputs(timeBlockData)
        if(validity == "No conflicts"){
            events.publish("userAvailabilityDataValidated",timeBlockData);
        }else{
            events.publish("userAvailabilityDataInvalidated", validity) //append this as list item
        }
    }
    
    function validateAllInputs(timeBlockData){
        let string = "A non-default value must be selected for the following: ";
        const emptySelectors = [];

        for(let prop in timeBlockData.block){
            if(prop != "admin" && timeBlockData.block[prop] == "default"){
                const propString = `${prop}`;
                emptySelectors.push(prop);
                string += propString

            }
        }
            
        if(emptySelectors.length > 0){
            return string
        }else{
            return "No conflicts"
        }
    }
})()

export {availabilityValidator}