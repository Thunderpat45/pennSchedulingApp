import { events } from "../events";

const facilityDataValidator = (function(){
    events.subscribe("adminFacilityDataValidationRequested", validateAdminFacilityData);
    
    function validateAdminFacilityData(facilityData){
        const string = "A non-default value must be selected for the following:";
        const emptySelectors = [];
  
        for(let prop in facilityData){
            if(facilityData[prop] == "default"){
                emptySelectors.push(prop);
            string.concat(", ", prop);
            }
        }

        if(emptySelectors.length > 0){
            alert(string) //return this to form append as list item
        }else{
            events.publish("adminFacilityDataValidated", facilityData)
        }
    }
})()

export {facilityDataValidator}