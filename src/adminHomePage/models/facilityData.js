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

    function setDataNewPageRender(adminData){
        adminFacilityDataStable = adminData.facilityData; 
        adminFacilityDataMutable = Object.create({});
        createFacilityDataDeepCopy(adminFacilityDataMutable, adminFacilityDataStable);
    }

    function setDataNewDatabasePost(){
        createFacilityDataDeepCopy(adminFacilityDataStable, adminFacilityDataMutable);
        events.publish("setNewSelectorRanges", adminFacilityDataMutable)
        events.publish("renderUpdatedFacilityData", adminFacilityDataMutable);
        events.publish("facilityDataAvailabiltyUpdateComparisonRequested", adminFacilityDataMutable)
    }

    function createFacilityDataDeepCopy(newObj, copyObj){
        for(let prop in copyObj){
            newObj[prop] = copyObj[prop]
        }
    }

    function editFacilityData(){
        events.publish("adminFacilityDataEditRequested", adminFacilityDataMutable)
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
        createFacilityDataDeepCopy(adminFacilityDataMutable, adminFacilityDataStable);
        events.publish("adminFacilityDataChangesCancelled")
    }
})()

export {adminMainPageFacilityDataModel}