import { events } from "../events";

/*purpose: dataModel from database for loading content for all adminPages

database object is modeled as such:

obj = {
    allTeams: 
        [{ 
            teamName,
            teamSize, 
            rank:
                {
                    myTeams,
                    allTeams
                },
            allOpts: [[{dayOfWeek, startTime, endTime, inWeiss}, {etc}], [{etc}, {etc}], []],
            //coach needs a source of data, work on that
        }, {etc}, {etc}]

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
        {day: [{start, stop, admin}, {start, stop, admin}], day: [{start, stop, admin}, {start, stop, admin}]} 

    season,
}

publishes:
    adminSelector builds requests FOR selectorDOMBuilder
    adminMainPageData model builds FOR adminMainPage DOM and all necessary adminDataModels

subscribes to: 
    data load FROM database
    adminMainPageDOM requests FROM adminUserGenerator cancellation AND ...
*/

const adminMainPageModel = (function(){


    //ensure proper database connection
    //determine if recursive copying for immutability is necessary directly off database
    //not on this page, but ensure backEnd selects default season or uses passed season variable to pull appropriate data, sort allTeams by rank and send to here/mainPageDataModel
    let adminMainPageModel = {
        allTeams: null,
        allUsers: null,
        facilitySelectors:null,
        adminTimeBlocks: null,
        season: null
    }

    events.subscribe("dataLoadedFromDatabase", populateDataModel);
    events.subscribe("adminMainPageDOMRequested", distributeAdminMainPageModel)

    function populateDataModel(databaseObj){ //check these for recursive immutable copying properly/necessary
        adminMainPageModel.allUsers = databaseObj.allUsers;
        adminMainPageModel.allTeams = databaseObj.allTeams;
        adminMainPageModel.facilitySelectors = databaseObj.facilitySelectors;
        adminMainPageModel.adminTimeBlocks = databaseObj.adminTimeBlocks;
        adminMainPageModel.season = databaseObj.season

        events.publish("adminSelectorsRequested", adminMainPageModel.facilitySelectors)

        distributeAdminMainPageModel();
    }

    function distributeAdminMainPageModel(){ //come back to this after checking selectorDOM progression
        events.publish("adminMainPageModelBuilt", adminMainPageModel)
    }

})()

export {adminMainPageModel}