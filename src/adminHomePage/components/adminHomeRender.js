import { events } from "../../../src/events";

// import {adminTeams} from "./components/teamGrid";
// import {adminUsers} from "./components/userGrid";

const adminHomeMain = (function(){

    events.subscribe("adminDataSet", setAdminEventListeners);

    function setAdminEventListeners(){
        setFacilityDataListeners()
        setUserDataListeners();
        setAdminTimeBlocksEventListeners();
    }

    function setFacilityDataListeners(){
        const facilityEditButton = document.querySelector("#adminMainPageFacilitySelectorsEditButton");
        facilityEditButton.addEventListener("click", requestAdminDataEdit);
    
        function requestAdminDataEdit(){
            events.publish("editFacilityDataClicked");
        }
    }

    function setUserDataListeners(){
        const addUserButton = document.querySelector("#adminUsersGridAddUser");
        
        const allUsers = Array.from(document.querySelectorAll(".adminUserGridUser"));
        if(allUsers.length >0){
            allUsers.forEach(function(user){
                const _id = user.dataset.userid;
                const editButton = user.querySelector(".adminUserGridUserEditButton");
                const deleteButton = user.querySelector(".adminUserGridUserDeleteButton")

                editButton.addEventListener("click", editUser);
                deleteButton.addEventListener("click", deleteUser);

                function editUser(){
                    events.publish("editUserClicked", _id)
                }
                function deleteUser(){
                    const confirmation = confirm("Delete this user?");
                    if(confirmation){
                        events.publish("deleteUserRequested", _id)
                    }
                }
            })
        }

        addUserButton.addEventListener("click", addUser)

        function addUser(){
            events.publish("addUserClicked")
        }
    }

    function setAdminTimeBlocksEventListeners(){
        const adminTimeBlockDays = Array.from(document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersGrid").children);

        adminTimeBlockDays.forEach(function(day){
            const dayString = day.querySelector("h3").innerText;
            const addBlockButton = day.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockAddButton");

            addBlockButton.addEventListener("click", addTimeBlock);

            const dayAllBlocks = Array.from(day.querySelectorAll(".adminMainPageAddAvailabilityBlockAllUsersAllBlocks > div"));
            if(dayAllBlocks.length > 0 ){
                dayAllBlocks.forEach(function(timeBlock){
                    const _id = timeBlock.dataset.timeblockid
                    const editBlockButton = timeBlock.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockEditButton");
                    const deleteBlockButton = timeBlock.querySelector(".adminMainPageAddAvailabilityBlockAllUsersBlockDeleteButton")

                    editBlockButton.addEventListener("click", editTimeBlock);
                    deleteBlockButton.addEventListener("click", deleteTimeBlock);

                    function editTimeBlock(){
                        events.publish("editAdminAvailabilityClicked", {day:dayString, _id})
                    }

                    function deleteTimeBlock(){
                        const confirmation = confirm("Delete this time block?");
                        if(confirmation){
                            events.publish("deleteAdminAvailabilityClicked", {day:dayString, _id})
                        }
                    }
                })
            }

            function addTimeBlock(){
                events.publish("addAdminTimeBlockClicked", dayString)
            }
        })
    }

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