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
        const string = "A non-default value must be selected for the following:";
        const emptySelectors = [];
  
        facilityData.ForEach(function(prop){
            if(prop == "default"){
                emptySelectors.push(prop);
            string.concat(", ", prop);
            }
        })

        if(emptySelectors.length > 0){
            alert(string)
        }else{
            events.publish("adminFacilityDataValidated", facilityData)
        }
    }
})()

export {facilityDataValidator}