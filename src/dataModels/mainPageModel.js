import { events } from "../events";

/*purpose: dataModel from database for loading content for user and adminPages

database object is modeled as such:

obj = {
    myteams/allTeams: 
        [{ 
            teamName,
            teamSize, 
            rank:
                {
                    myTeams,
                    allTeams
                },
            allOpts: [[{dayOfWeek, startTime, endTime, inWeiss}, {etc}], [{etc}, {etc}], []],
            coach,
        }, {etc}, {etc}]
    
    allUsers: [user, user, user]

    user:
        {
            name,
            color, //for ADMIN LEVEL ONLY
            privilegeLevel,
            teams:{},
            availability:{},
            lastVerified,
            adminPageSet,
            season
        }

    facilitySelectors:
        {facilityOpen, facilityClose, facilityMaxCapacity}

    season,
    adminPageSet,
    adminTimeBlocks:
        {day: [{start, stop, admin}, {start, stop, admin}], day: [{start, stop, admin}, {start, stop, admin}]}  //for ADMIN LEVEL ONLY
}

publishes:
    admin/userSelector builds requests FOR selectorDOMBuilder
    admin/userMainPageData model builds FOR admin/userMainPage DOM and all necessary dataModels

subscribes to: 
    data load FROM database
    pageChange requests from pageRenderer
    adminMainPageDOM requests FROM adminUserGenerator cancellation AND ...
*/

const mainPageModel = (function(){
    //facilitySelectors/adminPageSet/season all have to have a default value in databse to start
    //ensure proper database connection
    //determine if recursive copying for immutability is necessary directly off database
    //check lastVerified and season for proper execution

    let adminPageSet;

    let mainPageModel = {
        name: null,
        privilegeLevel: null,
        availability: null,
        myTeams: null,
        lastVerified:null,
        adminPageSet: null,
        season: null,
        allTeams: null,
        facilitySelectors:null,
    }

    let adminMainPageModel = {
        allTeams: null,
        allUsers: null,
        facilitySelectors:null,
        adminTimeBlocks: null,
        season: null
    }

    events.subscribe("dataLoadedFromDatabase", populateDataModels);
    events.subscribe("mainDataModelsPopulated", distributeModels)
    events.subscribe("mainPageDOMRequested", distributeMainPageModel);
    events.subscribe("adminMainPageDOMRequested", distributeAdminMainPageModel)
    events.subscribe("pageChangeRequested", setPageSetAndDistributeModel)



    function populateDataModels(databaseObj){//check these for recursive immutable copying properly/necessary, if not jsut do destructuring assingment

        populateGeneralUserModel(databaseObj);
        events.publish("mainPageSelectorsRequested", mainPageModel.facilitySelectors)
        
        if(databaseObj.user.adminPageSet != null){
            populateAdminUserModel(databaseObj)
            events.publish("adminSelectorsRequested", adminMainPageModel.facilitySelectors)
            adminPageSet = databaseObj.user.adminPageSet
        }

        events.publish("mainDataModelsPopulated")
    }

    function distributeModels(){
         if(adminPageSet == null || adminPageSet == "user"){
             distributeMainPageModel()
         }else{
             distributeAdminMainPageModel()
         }
    }

    function setPageSetAndDistributeModel(seasonIdentifier){
        if(adminPageSet != null){
            adminPageSet = seasonIdentifier
        }
        
        distributeModels();
    }


    function populateGeneralUserModel(databaseObj){
        mainPageModel.name = databaseObj.user.name;
        mainPageModel.privilegeLevel = databaseObj.user.privilegeLevel
        mainPageModel.availability = databaseObj.user.availability;
        mainPageModel.teams = databaseObj.user.teams; 
        mainPageModel.lastVerified = databaseObj.user.lastVerified;
        mainPageModel.season = databaseObj.user.season;
        mainPageModel.adminPageSet = databaseObj.user.adminPageSet
        
        mainPageModel.facilitySelectors = databaseObj.facilitySelectors
        mainPageModel.allTeams = databaseObj.allTeams; 
    }

    function populateAdminUserModel(databaseObj){
        adminMainPageModel.name = databaseObj.user.name
        adminMainPageModel.privilegeLevel = databaseObj.user.privilegeLevel
        adminMainPageModel.season = databaseObj.user.season

        adminMainPageModel.allUsers = databaseObj.allUsers;
        adminMainPageModel.allTeams = databaseObj.allTeams;
        adminMainPageModel.facilitySelectors = databaseObj.facilitySelectors;
        adminMainPageModel.adminTimeBlocks = databaseObj.adminTimeBlocks;
    }

    function distributeMainPageModel(){
        events.publish("mainPageModelBuilt", mainPageModel)
    }

    function distributeAdminMainPageModel(){
        events.publish("adminMainPageModelBuilt", adminMainPageModel)
    }

})();

export {mainPageModel}