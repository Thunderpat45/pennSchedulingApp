import {events} from "../events"

/* */

const adminMainPageFacilityDataModel = (function(){

    let adminFacilityDataModel;
    let adminFacilityDataModelCopy;
    
    events.subscribe("adminMainPageModelBuilt", setAdminFacilityDataModel);
    events.subscribe("modifyFacilitySelectorValue", modifyFacilitySelectorValue);
    events.subscribe("updateFacilityDataClicked", updateFacilityData);
    events.subscribe("cancelFacilityDataChangesClicked", cancelFacilityDataChanges);

    function setAdminFacilityDataModel(adminData){
        adminFacilityDataModel = adminData.facilitySelectors
        setAdminFacilityDataModelCopy()
    }

    function setAdminFacilityDataModelCopy(){ //make sure there is no need for deeper recursive copying
        adminFacilityDataModelCopy = Object.assign({}, adminFacilityDataModel);
        
    }
    function modifyFacilitySelectorValue(facilityDataObj){
        adminFacilityDataModelCopy[facilityDataObj.selector] = facilityDataObj.value;
    }
    function updateFacilityData(facilityDataObj){//listener is not yet specified, should be module that updates the DB
        events.publish("adminFacilityDataUpdated", facilityDataObj)
    }
    function cancelFacilityDataChanges(adminFacilityDataContainer){
        setAdminFacilityDataModelCopy();
        events.publish("adminFacilityModelModified", {adminFacilityDataContainer, adminMainPageData: adminFacilityDataModelCopy})
    }



})()

export {adminMainPageFacilityDataModel}