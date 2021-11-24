import { events } from "../events";

/*

actions: receives data from database, and publishes to sub-dataModels and mainPageDOM for use

publishes:
    allTeamsData
    myTeamsData
    availabilityData

subscribes to: 
    database fetches
    mainPageDOM data requests

*/

const mainPageModel = (function(){

    //does this need to have facilityData for setting up selectors (availability and teamRequest ranges?)
    let allTeams
    let mainPageModel = {
        availability: null,
        myTeams: null
    }

    events.subscribe("dataLoadedFromDatabase", populateDataModels); //check for intermediate steps here; make sure DB load publishes to other models
    events.subscribe("mainPageDOMRequested", distributeMainPageModel)

    function populateDataModels(databaseObj){
        mainPageModel.availability = databaseObj.availability;
        mainPageModel.myTeams = 
            Object.values(databaseObj.myTeams)
            .sort(function(a,b){
                return a.rank.myTeams - b.rank.myTeams
            })
        allTeams = Object.assign({}, databaseObj.allTeams); //check this

        distributeMainPageModel();
        distributeAllTeamsData();
     }

     function distributeMainPageModel(){
        events.publish("mainPageModelBuilt", mainPageModel)
     }

     function distributeAllTeamsData(){
         events.publish("allTeamsDataLoaded", allTeams)
     }

})();

export {mainPageModel}