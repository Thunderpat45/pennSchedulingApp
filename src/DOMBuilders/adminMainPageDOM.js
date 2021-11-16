import { events } from "../events";

const adminMainPageDOM = (function(){

    let season //figure this out
    let allTeams //set this on dataLoad
    
    events.subscribe("adminMainPageModelBuilt", publishAdminMainPageRender);
    events.subscribe("selectorsBuilt", setSelectorNodes) //add selector builds to selectorBuildDOM module for the fac Open/Close/Min/Max
    
    const selectorNodes = {
        facilityOpen: null,
        facilityClose: null,
        facilityMaxCapacity: null,
        startTime: null,
        endTime: null,
        dayOfWeek: null
    }
    
    function setSelectorNodes(obj){
        for(let prop in obj){
            switch(prop){
                case `facilityOpen`:
                case `facilityClose`:
                case `facilityMaxCapacity`:
                case `startTime`: //does name overlap here (class overlap) cause conflict??
                case `endTime`:
                case `dayOfWeek`:
                    selectorNodes[prop] = prop.value
                    break;
                default:
                    return;
            }	
        }
    }
    
    function publishAdminMainPageRender(adminMainPageData){
        const adminMainPageDOM = buildAdminMainPageDOM(adminMainPageData);
        events.publish("pageRenderRequested", adminMainPageDOM);
    }
    
    function buildAdminMainPageDOM(adminMainPageData){
        const template = document.querySelector("#adminMainPageTemplate");
        const content = document.importNode(template.content, true);
        
        const fallButton = content.querySelector("#fallButton");
        const springButton = content.querySelector("#springButton");
        const adminAllTeams = content.querySelector("#adminMainPageTeamGrid");
        const adminAllUsers = content.querySelector("#adminUsersGridContainer");
        const adminFacilityData = content.querySelector("#facilityDataGridContainer");
        const adminAddTimeBlock = content.querySelector("#setAllUsersAvailabilityGridContainer");
        const schedulerButton = content.querySelector("#runScheduleBuilderButton");
    
        const adminAllTeamsNew = renderAdminAllTeamsGrid(adminAllTeams, adminMainPageData.allTeams);
        const adminAllUsersNew = renderAdminAllUsersGrid(adminAllUsers, adminMainPageData);
        const adminFacilityDataNew = renderFacilityDataGrid(adminMainPageData);
        const adminAddTimeBlockNew = renderAdminTimeBlocker(adminMainPageData);
    
        adminAllTeams.replaceWith(adminAllTeamsNew);
        adminAllUsers.replaceWith(adminAllUsersNew);
        adminFacilityData.replaceWith(adminFacilityDataNew);
        adminAddTimeBlock.replaceWith(adminAddTimeBlockNew);
    
        adminAllTeamsNew.id = "adminTeamsGridContainer"
        adminAllUsersNew.id = "adminUsersGridContainer"
        adminFacilityDataNew.id = "facilityDataGridContainer"
        adminAddTimeBlockNew.id = "setAllUsersAvailabilityGridContainer"
    
        /* 
        fallButton.addEventListener
        springButton.addEventListener
        schedulerButton.addEventListener
        */
    
        return content
    
        /*
        event functions
        */	
    }
    
    function renderAdminAllTeamsGrid(teamGrid, allTeamsData){
       
        const teamGridNew = document.createElement("div")

        allTeamsData.forEach(function(team){
            const teamRow = buildAdminTeamRow(team, allTeamsData);
            teamGridNew.appendChild(teamRow);
        })
    
        teamGrid.replaceWith(teamGridNew);
        teamGridNew.id = "adminMainPageTeamGrid"
    
        return teamGridNew
    }
    
    function buildAdminTeamRow(teamData, allTeamsData){
        const template = document.querySelector("#adminMainPageTeamTemplate");
        const content = document.importNode(template.content, true);
    
        const teamName = content.querySelector(".adminMainPageTeamGridTeamName");
        const teamCoach = content.querySelector(".adminMainPageTeamGridTeamCoach");
        const teamSize = content.querySelector(".adminMainPageTeamGridTeamSize");
        const teamRank = content.querySelector(".adminMainPageTeamGridTeamRank");
        const teamButtons = content.querySelector(".adminMainPageTeamGridTeamsButtons");
        
        const uprankButton = document.createElement("button");
        const downrankButton = document.createElement("button");
    
        uprankButton.addEventListener("click", moveAdminRankUp);
        downrankButton.addEventListener("click", moveAdminRankDown);
        
    
        if(allTeamsData.length > 1 && teamData.rank.allTeams != 0 && teamData.rank.allTeams != allTeamsData.length - 1){ //make sure allTeams is right property
            teamButtons.appendChild(uprankButton);
            teamButtons.appendChild(downrankButton);
        }else if(allTeamsData.length > 1 && teamData.rank.allTeams != 0){
            teamButtons.appendChild(uprankButton)
        }else if(allTeamsData.length > 1 && teamData.rank.allTeams != allTeamsData.length - 1){
            teamButtons.appendChild(downrankButton)
        }
    
        
        teamName.innerText = teamData.teamName;
        teamCoach.innerText = teamData.coach;
        teamSize.innerText = teamData.teamSize;
        teamRank.innerText = teamData.rank.allTeams;
    
        return content
    
        function moveAdminRankUp(){
            events.publish("modifyAdminTeamOrder", {index: teamData.rank.allTeams, modifier: -1})
        }
        function moveAdminRankDown(){
            events.publish("modifyAdminTeamOrder", {index: teamData.rank.allTeams, modifier: 1})
        }
    }
    
    function renderAdminAllUsersGrid(adminAllUsersContainer, adminMainPageData){
    
        const userGrid = adminAllUsersContainer.querySelector("#adminUsersGrid");
        const addUserButton = adminAllUsersContainer.querySelector("#adminUsersGridAddUser");
        const userGridNew = renderAdminAllUsers((adminMainPageData));
    
        userGrid.replaceWith(userGridNew);
        userGridNew.id = "adminUsersGrid"
    
        //addUserButton eventListener
    
        return adminAllUsersContainer
    }
    
    function renderAdminAllUsers(adminMainPageData){
        const allUsers = document.createElement("div")
    
        adminMainPageData.allUsers.forEach(function(user){
            const userRow = buildAdminUserRow(user);
            allUsers.appendChild(userRow);
        })
    
        return allUsers;
    }
    
    function buildAdminUserRow(userData){
        const template = document.querySelector("#adminMainPageUserGridUserTemplate");
        const content = document.importNode(template.content, true);
    
        const userName = content.querySelector(".adminUserGridUserName");
        const userColor = content.querySelector(".adminUserGridUserColor");
        const userPrivilege = content.querySelector(".adminUserGridUserPrivilege");
        const userLastVerified = content.querySelector(".adminUserGridUserLastVerified");
        const userColorBlock = document.createElement("div");
    
        const editButton = content.querySelector(".adminUserGridUserEditButton");
        const deleteButton = content.querySelector(".adminUserGridUserDeleteButton");
    
        editButton.addEventListener("click", editUser);
        deleteButton.addEventListener("click", deleteUser);
    
    
        userName.innerText = userData.name;
        userPrivilege.innerText = userData.privilegeLevel;
        userLastVerified.innerText = userData.lastVerified;
    
        userColorBlock.style.background = userData.color
        userColor.appendChild(userColorBlock);
    
        return content
    
        function editUser(){
            events.publish("editUser", userData)
        }
        function deleteUser(){
            events.publish("deleteUser", userData)	
        }
    }
    
    function renderFacilityDataGrid(adminMainPageData){ //continue HERE
        const template = document.querySelector("#adminMainPageFacilitySelectorsGridTemplate");
        const content = document.importNode(template.content, true);
    
        const facilitySelectorsNodes = content.querySelectorAll(".select");
    
        facilitySelectorsNodes.forEach(function(selector){
            const primaryClass = Array.from(selector.classList)[0];
            
            const selectionNew = selectorNodes[`${primaryClass}`].cloneNode(true);
            selectionNew.addEventListener("change", publishSelectionValueChange)
    
            selectionNew.value = adminMainPageData.facilitySelectors[primaryClass];
            const selectedOption = selectionNew.querySelector(`option[value = ${selectionNew.value}]`);
            selectedOption.selected = true;
            
            selector.replaceWith(selectionNew);
    
            function publishSelectionValueChange(){
                const selector = primaryClass
                const value = selectionNew.value;
                events.publish("modifyFacilitySelectorValue", {selector, value})
            }
        })
    
    
        const saveButton = content.querySelector("#adminMainPageFacilitySelectorsSaveButton");
        const cancelButton = content.querySelector("#adminMainPageFacilitySelectorsCancelButton");
    
        //add eventListeners for save/cancel buttons
        
        return content
    
    } 
    
    function renderAdminTimeBlocker(adminMainPageData){ //add property to adminMainPage data to hold adminSetTimeBlocks ,, compare this against availabilityDOM, make sure storage object looks similar
        const template = document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersBlockTemplate");
        const content = document.importNode(template.content, true);
    
        const facilitySelectorsNodes = content.querySelectorAll(".select");
    
        facilitySelectorsNodes.forEach(function(selector){
            const primaryClass = Array.from(selector.classList)[0];
            
            const selectionNew = selectorNodes[`${primaryClass}`].cloneNode(true);
            selectionNew.addEventListener("change", publishSelectionValueChange)
    
            selectionNew.value = adminMainPageData.facilitySelectors[primaryClass];
            const selectedOption = selectionNew.querySelector(`option[value = ${selectionNew.value}]`);
            selectedOption.selected = true;
            
            selector.replaceWith(selectionNew);
    
            function publishSelectionValueChange(){ //block number??
                const selector = primaryClass
                const value = selectionNew.value;
                events.publish("modifyAdminTimeBlockSelectorValue", {selector, value})
            }
        })
    } //

})()

export {adminMainPageDOM}