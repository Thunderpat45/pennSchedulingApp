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

const mainPageModel = (function(){
    //figure out how this will work when admin clicks button to swtich between admin and user responsiblities
    //ensure proper database connection
    //determine if recursive copying for immutability is necessary directly off database
    
    
    //check lastVerified and season for proper execution

    let mainPageModel = {
        name: null,
        allTeams: null,
        availability: null,
        myTeams: null,
        facilitySelectors:null,
        lastVerified:null,
        season: null
    }

    events.subscribe("dataLoadedFromDatabase", populateDataModels);
    events.subscribe("mainPageDOMRequested", distributeMainPageModel)

    function populateDataModels(databaseObj){//check these for recursive immutable copying properly/necessary, if not jsut do destructuring assingment
        mainPageModel.name = databaseObj.user.name;
        mainPageModel.availability = databaseObj.user.availability;
        mainPageModel.teams = databaseObj.user.teams; 
        mainPageModel.lastVerified = databaseObj.user.lastVerified;
        
        mainPageModel.facilitySelectors = databaseObj.facilitySelectors //are these all lumped together in same object as user properties?
        mainPageModel.allTeams = databaseObj.allTeams;
        mainPageModel.season = databaseObj.season;

        events.publish("mainPageSelectorsRequested", mainPageModel.facilitySelectors)
        
        distributeMainPageModel();
     }

     function distributeMainPageModel(){
        events.publish("mainPageModelBuilt", mainPageModel)
     }

})();

export {mainPageModel}