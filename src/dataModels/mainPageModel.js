import { events } from "../events";

/*

/*purpose: dataModel from database for loading content for all userPages

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

    let mainPageModel = {
        allTeams: null,
        availability: null,
        myTeams: null,
        facilitySelectors:null,
        season: null //make sure this is properly done
    }

    events.subscribe("dataLoadedFromDatabase", populateDataModels);
    events.subscribe("mainPageDOMRequested", distributeMainPageModel)

    function populateDataModels(databaseObj){//check these for recursive immutable copying properly/necessary, if not jsut do destructuring assingment
        mainPageModel.availability = databaseObj.availability;
        mainPageModel.myTeams = databaseObj.myTeams; 
        mainPageModel.facilitySelectors = databaseObj.facilitySelectors
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