import { events } from "../events";

/* */

const adminMainPageModel = (function(){

    /*needs to receive:
        allTeams
        allUsers
        facilitySelectors
        */

    let adminMainPageModel = {
        allTeams: null,
        allUsers: null,
        facilitySelectors:null
    }


    events.subscribe("dataLoadedFromDatabase", populateDataModel); //check for intermediate steps here; make sure DB load publishes to other models
    events.subscribe("adminMainPageDOMRequested", distributeAdminMainPageModel)

    function populateDataModel(databaseObj){ //check these for recursive immutable copying properly
        adminMainPageModel.allUsers = databaseObj.allUsers;
        adminMainPageModel.allTeams = 
            Object.values(databaseObj.allTeams)
            .sort(function(a,b){
                return a.rank.allTeams - b.rank.allTeams
            })
        adminMainPageModel.facilitySelectors = databaseObj.facilitySelectors

        distributeAdminMainPageModel();
     }

     function distributeAdminMainPageModel(){
        events.publish("adminMainPageModelBuilt", adminMainPageModel)
     }

     

})()

export {adminMainPageModel}