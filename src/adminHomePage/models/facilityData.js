import {events} from "../../../src/events"

const adminMainPageFacilityDataModel = (function(){
  
    let adminFacilityDataStable;
    let adminFacilityDataMutable;

    events.subscribe("adminDataFetched", setDataNewPageRender);
    events.subscribe("facilityDataSaved", setDataNewDatabasePost); 
    events.subscribe("editFacilityDataClicked", editFacilityData) 

    events.subscribe("modifyFacilitySelectorValue", modifyFacilitySelectorValue);
    events.subscribe("updateFacilityDataClicked", validateFacilityData);
    events.subscribe("adminFacilityDataValidated", updateFacilityData);
    events.subscribe("cancelFacilityDataChangesClicked", cancelFacilityDataChanges);
    events.subscribe('facilityDataValidationFailed', renderFacilityDataValidationErrors)

    function setDataNewPageRender(adminData){
        adminFacilityDataStable= structuredClone(adminData.facilityData); 
        adminFacilityDataMutable = structuredClone(adminFacilityDataStable);
    }

    function setDataNewDatabasePost(){
        adminFacilityDataStable= structuredClone(adminFacilityDataMutable);
        events.publish("setNewSelectorRanges", adminFacilityDataMutable)
        events.publish("renderUpdatedFacilityData", adminFacilityDataMutable);
        events.publish("facilityDataAvailabiltyUpdateComparisonRequested", adminFacilityDataMutable)
    }

    function editFacilityData(){
        events.publish("adminFacilityDataEditRequested", {facilityData: adminFacilityDataMutable})
    }

    function modifyFacilitySelectorValue(facilityDataObj){
        const {modifiedSelector, value} = facilityDataObj
        adminFacilityDataMutable[modifiedSelector] = Number(value);
    }

    function validateFacilityData(){
        events.publish("adminFacilityDataValidationRequested", adminFacilityDataMutable)
    }

    function updateFacilityData(){
        events.publish("adminFacilityDataUpdateRequested", adminFacilityDataMutable);
    }
    
    function cancelFacilityDataChanges(){
        adminFacilityDataMutable= structuredClone(adminFacilityDataStable);
        events.publish("adminFacilityDataChangesCancelled")
    }

    function renderFacilityDataValidationErrors(validationErrorData){
        const errors = validationErrorData
        events.publish("renderFacilityDataValidationErrors", {facilityData: adminFacilityDataMutable, errors})
    }
})()

export {adminMainPageFacilityDataModel}