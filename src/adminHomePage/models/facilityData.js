import {events} from "../../../src/events"

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


//start EDITING HERE, I WANT FACILITYDATA TO BE CONNECTED BY THE END OF TONIGHT!
const adminMainPageFacilityDataModel = (function(){
    //no obvious issues, find database listener for data update
    let adminFacilityDataStable;
    let adminFacilityDataMutable;

    events.subscribe("hibbilty", console.log("Does this end it?"))
    
    events.subscribe("adminDataFetched", setDataNewPageRender);
    events.subscribe("facilityDataSaved", setDataNewDatabasePost); //add prompt about successful post
    events.subscribe("editFacilityDataClicked", editFacilityData) //add prompt about requesting dataEdit

    events.subscribe("modifyFacilitySelectorValue", modifyFacilitySelectorValue);
    events.subscribe("updateFacilityDataClicked", validateFacilityData);
    events.subscribe("adminFacilityDataValidated", updateFacilityData);
    events.subscribe("cancelFacilityDataChangesClicked", cancelFacilityDataChanges);

    function setDataNewPageRender(adminData){
        adminFacilityDataStable = adminData.facilityData; //make sure this is correct property for database initial database fetch
        adminFacilityDataMutable = Object.create({});
        for(let prop in adminFacilityDataStable){
            adminFacilityDataMutable[prop] = adminFacilityDataStable[prop]
        }
    }

    function setDataNewDatabasePost(){
        createFacilityDataDeepCopy(adminFacilityDataStable, adminFacilityDataMutable);
        events.publish("renderUpdatedFacilityData", adminFacilityDataMutable)
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