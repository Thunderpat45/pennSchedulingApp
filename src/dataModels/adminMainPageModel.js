import { events } from "../events";

/*action: receives dataModel from database for loading content for all adminPages
object is modeled as such:

obj = {



}

publishes:
    adminMainPageData model builds

subscribes to: 
    data load
        FROM database

   adminMainPageDOM requests
        FROM adminMainPage (?)dataModel(?)
*/

const adminMainPageModel = (function(){



    let adminMainPageModel = {
        allTeams: null,
        allUsers: null,
        facilitySelectors:null,
        adminTimeBlocks: null
    }


    //need season property

    events.subscribe("dataLoadedFromDatabase", populateDataModel); //check for intermediate steps here; make sure DB load publishes to other models
    events.subscribe("adminMainPageDOMRequested", distributeAdminMainPageModel)

    function populateDataModel(databaseObj){ //check these for recursive immutable copying properly/necessary
        adminMainPageModel.allUsers = databaseObj.allUsers;
        adminMainPageModel.allTeams = databaseObj.allTeams;
        adminMainPageModel.facilitySelectors = databaseObj.facilitySelectors;
        adminMainPageModel.adminTimeBlocks = databaseObj.adminTimeBlocks;

        events.publish("adminSelectorsRequested", databaseObj.facilitySelectors) //check these parameters

        distributeAdminMainPageModel();
     }

     function distributeAdminMainPageModel(){
        events.publish("adminMainPageModelBuilt", adminMainPageModel)
     }

     /*
     allTeams:

     allUsers:
        [{
            name,
            color,
            password, //MAKE SURE THIS DOES NOT GET PASSED TO FRONT END
            privilegeLevel,
            teams:{},
            availability:{},
            lastVerified
        }, {etc}, {etc}]

     facilitySelectors:

     {facilityOpen, facilityClose, facilityMaxCapacity}

     adminTimeBlocks:

     {day: [{start, stop}, {start, stop}], day: [{start, stop}, {start, stop}]}, all days already input, make sure empties don't screw anything up




     
     */
     

})()

export {adminMainPageModel}