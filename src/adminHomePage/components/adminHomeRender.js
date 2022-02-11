import { events } from "../../../src/events";

// import {adminTeams} from "./components/teamGrid";
// import {adminUsers} from "./components/userGrid";

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

const adminHomeMain = (function(){

    events.subscribe("adminDataSet", setAdminEventListeners); //some prompt about setting data in client models

    function setAdminEventListeners(){
        setFacilityDataListeners()
    }

    function setFacilityDataListeners(){
        const facilityEditButton = document.querySelector("#adminMainPageFacilitySelectorsEditButton");
        facilityEditButton.addEventListener("click", requestAdminDataEdit);
    
        function requestAdminDataEdit(){
            events.publish("editFacilityDataClicked");
        }
    
    
    }





//     events.subscribe("", renderAdminTimeBlocksForm) //add listener for render click

//     function renderAdminTimeBlocksForm(adminTimeBlockDayData){
//         renderTimeBlockDataForm(adminTimeBlockDayData);
//     }

//     function setAdminTimeBlockListeners(){
//         const dayBlocks = Array.from(document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersGrid").children);
//         dayBlocks.forEach(function(day){
//             const dayName = day.firstChild("h3").innerText;
//             const addButton = day.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockAddButton")

//             const timeBlocks = Array.from(day.querySelector(".adminMainPageAddAvailabilityBlockAllUsersAllBlocks"))
//             timeBlocks.forEach(function(block){
//                 const _id = block.dataset.dataTimeBlockId;
//                 const editButton = block.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockEditButton");
//                 const deleteButton = block.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockDeleteButton");

//                 editButton.addEventListener("click", requestAvailabilityBlockEdit);
//                 deleteButton.addEventListener("click", requestAvailabilityBlockDelete);

//                 function requestAvailabilityBlockEdit(){
//                     //class change?
//                     events.publish("editAdminAvailabilityClicked", {day, _id})
                    
//                 }
//                 function requestAvailabilityBlockDelete(){
//                     events.publish("deleteAdminAvailabilityClicked", {day, _id})
//                 }
//             })

//             addButton.addEventListener("click" , requestAvailabilityBlockNew);

//             function requestAvailabilityBlockNew(){
//                 //class change?
//                 events.publish("adminAvailabilityBlockAddRequested", day)

//             }
//         })     
//     }  
})()

export {adminHomeMain}

  // let season //?
    
    // events.subscribe("adminMainPageModelBuilt", setSeason)
    // events.subscribe("adminMainPageModelBuilt", ANOTHERFUNCTIONHERE?);
    // events.subscribe("adminAvailabilityModelModified", renderAdminAllTimeBlocks);
    // events.subscribe("adminFacilityModelModified", renderFacilityDataGrid)
    
    // function setSeason(adminMainPageData){
    //     season = adminMainPageData.season
    // }

    // function changeSeason(){
            
    // }

    // function runScheduler(){
    //     events.publish("runSchedulerRequested") 
    // }

    // //find subscribers to changeSeasons and runScheduler, issue NOT TO BE ADDRESSED:  scheduler could be run with unsaved modifications to adminAvail and facilityData
    // function buildAdminMainPageDOM(adminMainPageData){
       
        
    
     
        
    //     const adminFacilityData = content.querySelector("#facilityDataGridContainer");
    //     const adminAddTimeBlock = content.querySelector("#setAllUsersAvailabilityGridContainer");
        
    
    //     const adminAllUsersNew = renderAdminAllUsersGrid(adminAllUsers, adminMainPageData.allUsers);
    //     const adminFacilityDataNew = renderFacilityDataGrid({adminFacilityDataContainer: adminFacilityData, adminMainPageData: adminMainPageData.facilitySelectors, pageRenderOrigin: "template"});
    //     const adminAddTimeBlockNew = renderAdminTimeBlocker({adminTimeBlockDiv: adminAddTimeBlock, adminMainPageData: adminMainPageData.adminTimeBlocks, pageRenderOrigin: "template"});
    
    //     adminAllUsers.replaceWith(adminAllUsersNew); 
    //     adminFacilityData.replaceWith(adminFacilityDataNew);
    //     adminAddTimeBlock.replaceWith(adminAddTimeBlockNew);
    
    //     seasonButtons.forEach(function(button){
    //         if(!button.disabled){
    //             button.addEventListener("click", changeSeason)
    //         }else{
                
               
    //         }
    //     })

    //     schedulerButton.addEventListener("click", runScheduler)   
    // }

    // function setElements(){
        
        
    //     const seasonButtons = Array.from(content.querySelectorAll("#adminSeasonButtons > button"));
    //     const schedulerButton = content.querySelector("#runScheduleBuilderButton");
    // }