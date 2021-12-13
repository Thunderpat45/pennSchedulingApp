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
    
    function validateAllAdminAvailability(availabilityData){
        if(validateAllInputs(availabilityData) == "No conflicts"){
            events.publish("adminAvailabilityDataValidated",availabilityData)
        }
    }
    
    function validateAllUserAvailability(availabilityData){
         if(validateAllInputs(availabilityData) == "No conflicts"){
            events.publish("userAvailabilityDataValidated",availabilityData);
        }
    }
    
    function validateAllInputs(availabilityData){
        let string = "A non-default value must be selected for the following: ";
        const emptySelectors = [];

        for(let day in availabilityData){
            let dayString = `${day}--`;
            const dayEmptySelectors = [];
            availabilityData[day].forEach(function(block){
                for(let prop in block){
                    if(block[prop] == "default"){
                        dayEmptySelectors.push(prop);
                        dayString += `${prop}; `;
                    }
                }
            })

            if(dayEmptySelectors.length > 0){
                emptySelectors.push(dayEmptySelectors);
                string += `${dayString}` ;
            }
        }

        if(emptySelectors.length > 0){
            alert(string)
        }else{
            return "No conflicts"
        }
    }
})()

export {availabilityValidator}