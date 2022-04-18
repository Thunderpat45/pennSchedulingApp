import { events } from "../events";

const facilityDataValidator = (function(){
    
    events.subscribe("adminFacilityDataValidationRequested", validateAdminFacilityData);
    
    function validateAdminFacilityData(facilityData){
        
        const errorArray = [];
  
        for(let prop in facilityData){
            
            if(facilityData[prop] == "default"){
                const string = "A non-default value must be selected for: ";
                string.concat(prop);
                errorArray.push(string);
            }
        }

        if(facilityData.facilityOpen >= facilityData.facilityClose){
            errorArray.push('Start time overlaps with end time!')
        }

        if(errorArray.length > 0){
            events.publish('facilityDataValidationFailed', errorArray)
        }else{
            events.publish("adminFacilityDataValidated", facilityData)
        }
    }
})()

export {facilityDataValidator}