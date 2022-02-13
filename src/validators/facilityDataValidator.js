import { events } from "../events";

/*purpose: validator for facilityData updates

facilityData object is modeled as such:

obj = {
    facilityOpen, 
    facilityClose, 
    facilityMaxCapacity
}

publishes:
    successful validations FOR adminMainPageFacilityDataModel
   
subscribes to: 
    validation requests FROM adminMainPageFacilityDataModel
*/

const facilityDataValidator = (function(){
    //no obvious issues here
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

        if(errorArray.length > 0){
            alert(errorArray) //change this eo event that returns to form as list items
        }else{
            events.publish("adminFacilityDataValidated", facilityData)
        }
    }
})()

export {facilityDataValidator}