import { events } from "../events";

/*purpose: dataModel from database for loading content for all userPages

database object is modeled as such:

obj = {
    teams:, and allTeams: 
        [{ 
            teamName,
            teamSize, 
            rank:
                {
                    myTeams,
                    allTeams
                },
            allOpts: [[{dayOfWeek, startTime, endTime, inWeiss}, {etc}], [{etc}, {etc}], []],
            coach
        }, {etc}, {etc}]

    user:
        {
            name,
            teams:{},
            availability:{},
            lastVerified
        }

    facilitySelectors:
        {facilityOpen, facilityClose, facilityMaxCapacity}

    season,
}

publishes:
    userSelector builds requests FOR selectorDOMBuilder
    userMainPageData model builds FOR userMainPage DOM and all necessary userDataModels

subscribes to: 
    data load FROM database
    userMainPageDOM requests FROM 
*/

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

const mainPageModel = (function(){ START HERE AND FIX THIS

    //ensure proper database connection
    //determine if recursive copying for immutability is necessary directly off database
    //check lastVerified and season for proper execution

    let pageSet;

    let mainPageModel = {
        name: null,
        privilegeLevel: null,
        availability: null,
        myTeams: null,
        lastVerified:null,
        season: null,
        allTeams: null,
        facilitySelectors:null,
        pageSet: null,
    }

    let adminMainPageModel = {
        allTeams: null,
        allUsers: null,
        facilitySelectors:null,
        adminTimeBlocks: null,
        season: null
    }

    events.subscribe("dataLoadedFromDatabase", populateDataModels);
    events.subscribe("mainPageDOMRequested", distributeMainPageModel);
    events.subscribe("adminMainPageDOMRequested", distributeAdminMainPageModel)



    function populateDataModels(databaseObj){//check these for recursive immutable copying properly/necessary, if not jsut do destructuring assingment
        mainPageModel.name = databaseObj.user.name;
        mainPageModel.privilegeLevel = databaseObj.user.privilegeLevel
        mainPageModel.availability = databaseObj.user.availability;
        mainPageModel.teams = databaseObj.user.teams; 
        mainPageModel.lastVerified = databaseObj.user.lastVerified;
        
        mainPageModel.facilitySelectors = databaseObj.facilitySelectors //are these all lumped together in same object as user properties?
        mainPageModel.allTeams = databaseObj.allTeams;
        mainPageModel.season = databaseObj.season;
        mainPageModel.pageSet = databaseObj.pageSet

        adminMainPageModel.allUsers = databaseObj.allUsers;
        adminMainPageModel.allTeams = databaseObj.allTeams;
        adminMainPageModel.facilitySelectors = databaseObj.facilitySelectors;
        adminMainPageModel.adminTimeBlocks = databaseObj.adminTimeBlocks;
        adminMainPageModel.season = databaseObj.season

        
        
        events.publish("mainPageSelectorsRequested", mainPageModel.facilitySelectors)
        
        distributeMainPageModel();

        events.publish("adminSelectorsRequested", adminMainPageModel.facilitySelectors)

        distributeAdminMainPageModel();
     }

     function distributeMainPageModel(){
        events.publish("mainPageModelBuilt", mainPageModel)
     }

    function distributeAdminMainPageModel(){
        events.publish("adminMainPageModelBuilt", adminMainPageModel)
    }

})();

export {mainPageModel}