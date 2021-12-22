import {events} from "../events"

/*purpose: dataModel for modifying/saving facilityData content for adminMainPage

database object is modeled as such:

obj = {
    facilityOpen, 
    facilityClose, 
    facilityMaxCapacity
}

publishes:
    facilityDataDOM renders FOR adminMainPageDOM
    save requests FOR databse
   
subscribes to: 
    adminMainPageModel builds FROM adminMainPageModel
    data modification changes FROM adminMainPageDOM
    save change and cancel change requests FROM adminMainPageDOM
*/

const adminMainPageFacilityDataModel = (function(){
    //no obvious issues, find database listener for data update
    let adminFacilityDataModel;
    let adminFacilityDataModelCopy;
    
    events.subscribe("adminMainPageModelBuilt", setAdminFacilityDataModel);
    events.subscribe("modifyFacilitySelectorValue", modifyFacilitySelectorValue);
    events.subscribe("updateFacilityDataClicked", validateFacilityData);
    events.subscribe("adminFacilityDataValidated", updateFacilityData);
    events.subscribe("cancelFacilityDataChangesClicked", cancelFacilityDataChanges);

    function setAdminFacilityDataModel(adminData){
        adminFacilityDataModel = adminData.facilitySelectors
        setAdminFacilityDataModelCopy()
    }

    function setAdminFacilityDataModelCopy(){
        adminFacilityDataModelCopy = Object.assign({}, adminFacilityDataModel);
        
    }
    function modifyFacilitySelectorValue(facilityDataObj){
        adminFacilityDataModelCopy[facilityDataObj.selector] = facilityDataObj.value;
    }

    function validateFacilityData(){
        events.publish("adminFacilityDataValidationRequested", adminFacilityDataModelCopy)
    }

    function updateFacilityData(){
        events.publish("adminFacilityDataUpdated", adminFacilityDataModelCopy);
    }
    function cancelFacilityDataChanges(adminFacilityDataContainer){
        setAdminFacilityDataModelCopy();
        events.publish("adminFacilityModelModified", {adminFacilityDataContainer, adminMainPageData: adminFacilityDataModel, pageRenderOrigin: "dataChange"})
    }



})()

export {adminMainPageFacilityDataModel}