import {events} from "./events"

const temporaryDatabasePostSimulator = (function(){

    events.subscribe("allUsersDataUpdated", alertAndLogCurrentObject);
    events.subscribe("adminAvailabilityDataUpdated", alertAndLogCurrentObject)
    events.subscribe("adminAllTeamsDataUpdated", alertAndLogCurrentObject)
    events.subscribe("adminFacilityDataUpdated", alertAndLogCurrentObject)
    events.subscribe("availabilityDataUpdated", alertAndLogCurrentObject)
    events.subscribe("myTeamsDataUpdated", alertAndLogCurrentObject)
    events.subscribe("verifyUpToDateClicked", alertAndLogCurrentObject)
    events.subscribe("pageChangeRequested", alertAndLogCurrentObject);
    events.subscribe("userSeasonChangeRequested", alertAndLogCurrentObject);
    events.subscribe("adminSeasonChangeRequested", alertAndLogCurrentObject);
    events.subscribe("userAvailabilityDataValidated", alertAndLogCurrentObject);

    
    function alertAndLogCurrentObject(databaseBoundObject){
        alert(databaseBoundObject);
        console.log(databaseBoundObject)
    }

})();

export {temporaryDatabasePostSimulator}