import { events } from "../events";
import {adminTeams} from "./components/teamGrid";
import {adminUsers} from "./components/userGrid";

/*action: admin interface for observing allTeams/allUsers, setting facility parameters, blocking off time for all users, and running the scheduling function

adminMainPageData object is modeled as such:

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
            coach,
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
        {day: [{{startTime, stopTime, admin}, {startTime, stopTime, admin}, ], day: [{startTime, stopTime, admin}, {startTime, stopTime, admin}]},  make sure empties don't screw anything up

    season,
}

adminSelectorsObj is modeled as such:

obj = {

    startTime: (pre-built select HTML element),
    endTime: etc,
    teamSize: etc,
    facilityOpen: etc,
    facilityClose: etc,
    facilityMaxCapacity: etc,
    dayOfWeek: etc,
    inWeiss: etc
}

publishes:
    page render requests FOR pageRenderer
    season change requests FOR (?)
    scheduler run requests FOR (?)
    admin allTeam rank changes FOR adminAllTeamsDataModel
    user add requests FOR adminUserGeneratorModel 
    user edit/delete requests for adminAllUsersDataModel
    facilityData changes, save requests, and change cancellations FOR adminMainPageFacilityDataModel
    

subscribes to: 
    adminMainPageModel builds FROM adminMainPageModel
    adminSelectorsBuilt FROM selectorDOMBuilder
    adminAvailability and adminFacility model updates FROM adminAvailabity and adminFacility data models
*/

const adminMainPageDOM = (function(){

    let season
    
    events.subscribe("adminSelectorsBuilt", setSelectorNodes);
    events.subscribe("adminMainPageModelBuilt", setSeason)
    events.subscribe("adminMainPageModelBuilt", ANOTHERFUNCTIONHERE?);
    events.subscribe("adminAvailabilityModelModified", renderAdminAllTimeBlocks);
    events.subscribe("adminFacilityModelModified", renderFacilityDataGrid)
    
    
    const selectorNodes = {
        facilityOpen: null,
        facilityClose: null,
        facilityMaxCapacity: null,
        startTime: null,
        endTime: null
    }
    //watch for CSS conflicts on start/endTime between this, userAvailability and requestFormDOMs
    function setSelectorNodes(selectorElementObj){
        for(let selectorElement in selectorElementObj){
            switch(selectorElement){
                case `facilityOpen`:
                case `facilityClose`:
                case `facilityMaxCapacity`:
                case `startTime`: //watch CSS between this and requestFormDOM
                case `endTime`:
                    selectorNodes[selectorElement] = selectorElementObj[selectorElement]
                    break;
                default:
                    break;
            }	
        }
    }
    
    function setSeason(adminMainPageData){
        season = adminMainPageData.season
    }

    function changeSeason(){
            
    }

    function runScheduler(){
        events.publish("runSchedulerRequested") 
    }

    //find subscribers to changeSeasons and runScheduler, issue NOT TO BE ADDRESSED:  scheduler could be run with unsaved modifications to adminAvail and facilityData
    function buildAdminMainPageDOM(adminMainPageData){
       
        const seasonButtons = content.querySelector("#adminSeasonButtons");
        const seasonButtonsChildren = Array.from(seasonButtons.children)
     
        
        const adminFacilityData = content.querySelector("#facilityDataGridContainer");
        const adminAddTimeBlock = content.querySelector("#setAllUsersAvailabilityGridContainer");
        const schedulerButton = content.querySelector("#runScheduleBuilderButton");
    
        const adminAllUsersNew = renderAdminAllUsersGrid(adminAllUsers, adminMainPageData.allUsers);
        const adminFacilityDataNew = renderFacilityDataGrid({adminFacilityDataContainer: adminFacilityData, adminMainPageData: adminMainPageData.facilitySelectors, pageRenderOrigin: "template"});
        const adminAddTimeBlockNew = renderAdminTimeBlocker({adminTimeBlockDiv: adminAddTimeBlock, adminMainPageData: adminMainPageData.adminTimeBlocks, pageRenderOrigin: "template"});
    
        adminAllUsers.replaceWith(adminAllUsersNew); 
        adminFacilityData.replaceWith(adminFacilityDataNew);
        adminAddTimeBlock.replaceWith(adminAddTimeBlockNew);
    
        seasonButtonsChildren.forEach(function(child){
            if(child.id == `${season}Button`){
                child.disabled = true;
            }else{
                child.addEventListener("click", changeSeason)
               
            }
        })

        schedulerButton.addEventListener("click", runScheduler)   
    }




    
   

    
    
    
})()

export {adminMainPageDOM}