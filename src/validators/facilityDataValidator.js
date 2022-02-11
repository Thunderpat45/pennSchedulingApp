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
        const string = "A non-default value must be selected for the following: ";
        const emptySelectors = [];
  
        for(let prop in facilityData){
            if(facilityData[prop] == "default"){
                emptySelectors.push(prop);
                if(emptySelectors.length >1){
                    string.concat(", ", prop);
                }else{
                    string.concat(prop);
                }
            }
        }

        if(emptySelectors.length > 0){
            alert(string) //change this to return errorContent to form
        }else{
            events.publish("adminFacilityDataValidated", facilityData)
        }
    }
})()

export {facilityDataValidator}