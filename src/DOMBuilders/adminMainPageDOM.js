import { events } from "../events";

const adminMainPageDOM = (function(){

    let season //figure this out
    
    events.subscribe("adminMainPageModelBuilt", publishAdminMainPageRender);
    events.subscribe("adminAvailabilityModelModified", renderAdminAllTimeBlocks);
    events.subscribe("adminFacilityModelModified", renderFacilityDataGrid)
    events.subscribe("adminSelectorsBuilt", setSelectorNodes);
    
    const selectorNodes = {
        facilityOpen: null,
        facilityClose: null,
        facilityMaxCapacity: null,
        startTime: null,
        endTime: null
    }
    
    function setSelectorNodes(obj){
        for(let prop in obj){
            switch(prop){
                case `facilityOpen`:
                case `facilityClose`:
                case `facilityMaxCapacity`:
                case `startTime`: //does name overlap here (class overlap) cause conflict?? it shouldn't....
                case `endTime`:
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
        const adminAllUsersNew = renderAdminAllUsersGrid(adminAllUsers, adminMainPageData.allUsers);
        const adminFacilityDataNew = renderFacilityDataGrid({adminFacilityDataContainer: adminFacilityData, adminMainPageData: adminMainPageData.facilitySelectors});
        const adminAddTimeBlockNew = renderAdminTimeBlocker(adminAddTimeBlock, adminMainPageData.adminTimeBlocks);
    
        adminAllTeams.replaceWith(adminAllTeamsNew);
        adminAllUsers.replaceWith(adminAllUsersNew);
        adminFacilityData.replaceWith(adminFacilityDataNew);
        adminAddTimeBlock.replaceWith(adminAddTimeBlockNew);
    
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
    
        function moveAdminRankUp(){ //MAKE EVENTS ACTUALLY OCCUR FOR THIS, ALL TEAMS OR INDIVIDUAL TEAM LEVEL
            events.publish("modifyAdminTeamOrder", {index: teamData.rank.allTeams, modifier: -1})
        }
        function moveAdminRankDown(){
            events.publish("modifyAdminTeamOrder", {index: teamData.rank.allTeams, modifier: 1})
        }
    }
    
    function renderAdminAllUsersGrid(adminAllUsersContainer, adminMainPageData){
    
        const userGrid = adminAllUsersContainer.querySelector("#adminUsersGrid");
        const addUserButton = adminAllUsersContainer.querySelector("#adminUsersGridAddUser");
        const userGridNew = renderAdminAllUsers(adminMainPageData);
    
        userGrid.replaceWith(userGridNew);
        
        addUserButton.addEventListener("click", addUser)
    
        return adminAllUsersContainer

        function addUser(){
            events.publish("addUser")
        }
    }
    
    function renderAdminAllUsers(adminMainPageData){
        const allUsers = document.createElement("div");
        allUsers.id = "adminUsersGrid";
    
        adminMainPageData.forEach(function(user){
            const userRow = buildAdminUserRow(user);
            allUsers.appendChild(userRow);
        })

        return allUsers;
    }
    
    function buildAdminUserRow(userData){
        const template = document.querySelector("#adminMainPageUserGridUserTemplate");
        const content = document.importNode(template.content, true);
    
        const userName = content.querySelector(".adminUserGridUserName");
        const userPrivilege = content.querySelector(".adminUserGridUserPrivilege");
        const userLastVerified = content.querySelector(".adminUserGridUserLastVerified");
        const userColorBlock = content.querySelector(".adminUserColor");
    
        const editButton = content.querySelector(".adminUserGridUserEditButton");
        const deleteButton = content.querySelector(".adminUserGridUserDeleteButton");
    
        editButton.addEventListener("click", editUser);
        deleteButton.addEventListener("click", deleteUser);
    
        userName.innerText = userData.name;
        userPrivilege.innerText = userData.privilegeLevel;
        userLastVerified.innerText = userData.lastVerified;
        userColorBlock.style.background = userData.color
    
        return content
    
        function editUser(){
            events.publish("editUser", userData)
        }
        function deleteUser(){
            events.publish("deleteUser", userData)	
        }
    }
    //renderFacilityDataGrid display is: facilityOpen selector, facilityClose selector, facility maxCapacity, saveButton, cancelButton
    function renderFacilityDataGrid(obj){
        
        const adminFacilityDataContainer = obj.adminFacilityDataContainer;
        const adminMainPageData = obj.adminMainPageData;

        const template = document.querySelector("#adminMainPageFacilityDataGridTemplate");
        const content = document.importNode(template.content, true);

        const facilityGridNew = content.querySelector("#facilityDataGrid");
        const facilitySelectorsNodes = content.querySelectorAll(".select");
        const saveButton = content.querySelector("#adminMainPageFacilitySelectorsSaveButton");
        const cancelButton = content.querySelector("#adminMainPageFacilitySelectorsCancelButton");
    
        facilitySelectorsNodes.forEach(function(selector){
            const primaryClass = Array.from(selector.classList)[0];
            
            const selectionNew = selectorNodes[`${primaryClass}`].cloneNode(true);
            selectionNew.addEventListener("change", publishSelectionValueChange)
    
            selectionNew.value = adminMainPageData[primaryClass];
            const selectedOption = selectionNew.querySelector(`option[value = ${selectionNew.value}]`);
            selectedOption.selected = true;
            
            selector.replaceWith(selectionNew);
    
            function publishSelectionValueChange(){
                const selector = primaryClass
                const value = selectionNew.value;
                events.publish("modifyFacilitySelectorValue", {selector, value})
            }
        })

        saveButton.addEventListener("click", updateFacilityData);
        cancelButton.addEventListener("click", cancelFacilityDataChanges);
    
        function updateFacilityData(){
            events.publish("updateFacilityDataClicked", adminMainPageData)
        }
        function cancelFacilityDataChanges(){
            events.publish("cancelFacilityDataChangesClicked", adminFacilityDataContainer)
        }
        
        const facilityGrid = document.querySelector("#facilityDataGrid");
        if(facilityGrid != null){
            facilityGrid.replaceWith(facilityGridNew)
        }else{
            adminFacilityDataContainer.appendChild(facilityGridNew)
            return adminFacilityDataContainer
        }
    
    } 
    
    //adminTimeBlocker display is blockGrid (allTimeBlocks), saveChanges, cancelChanges buttons
    function renderAdminTimeBlocker(adminTimeBlockDiv, adminMainPageData){
     
        const adminTimeBlockGrid = adminTimeBlockDiv.querySelect("#adminMainPageAddAvailabilityBlockAllUsersGrid");
        const adminSaveTimeBlockButton = adminTimeBlockDiv.querySelect("#adminMainPageAddAvailabilityBlockAllUsersSaveButton");
        const adminCancelTimeBlockChangesButton = adminTimeBlockDiv.querySelect("#adminMainPageAddAvailabilityBlockAllUsersCancelButton");
        
        const adminTimeBlockGridNew = renderAdminAllTimeBlocks({adminTimeBlockDiv, adminMainPageData});

        adminTimeBlockGrid.replaceWith(adminTimeBlockGridNew);
    
        adminSaveTimeBlockButton.addEventListener("click", updateAdminAvailability);
        adminCancelTimeBlockChangesButton.addEventListener("click", cancelAdminAvailabilityChanges);

        return adminTimeBlockDiv

        function updateAdminAvailability(){
            events.publish("updateAdminAvailabilityClicked", adminMainPageData)
        }
        function cancelAdminAvailabilityChanges(){
            events.publish("cancelAdminAvailabilityChangesClicked", adminTimeBlockDiv)
        }
    }
    //allTimeBlocks display is forEach day (Day Label, addButton, [row for each timeBlock])
    function renderAdminAllTimeBlocks(obj){
        const adminTimeBlockDiv = obj.adminTimeBlockDiv;
        const adminMainPageData = obj.adminMainPageData
        const allTimeBlocksNew = document.createElement("div")
        allTimeBlocksNew.id = "adminMainPageAddAvailabilityBlockAllUsersGrid" //does this need to be in if statement?
    
        for(let day in adminMainPageData){
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("adminTimeBlockDay");

            const label = document.createElement("h3");
            const addButton = document.createElement("button");

            label.innerText = `${day}`;

            dayDiv.appendChild(label);
            dayDiv.appendChild(addButton)

            day.forEach(function(timeBlock){
                const blockNumber = day.indexOf(timeBlock);
                const row = buildAdminTimeBlockRow(adminTimeBlockDiv, day, timeBlock, blockNumber);
                dayDiv.appendChild(row)
            })

            addButton.addEventListener("click", function addAdminTimeBlock(){
                events.publish('addAdminTimeBlockClicked', {adminTimeBlockDiv, day})
            });
        }

        const allTimeBlocks = document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersGrid");
        if(allTimeBlocks != null){
            allTimeBlocks.replaceWith(allTimeBlocksNew)
        }else{
            return allTimeBlocksNew
        }
    }

    //adminBlockRow display is (startTime selector, endTime selector, deleteButton)
    function buildAdminTimeBlockRow(adminTimeBlockDiv, day, timeBlock, blockNumber){
        const template = document.querySelector("#adminMainPageAddAvailabilityBlockAllUsersBlockTemplate");
        const content = document.importNode(template.content, true);

        const selectorsNodes = content.querySelectorAll(".select");
        const deleteButton = content.querySelector("#adminMainPageAddAvailabilityBlockAllUsersBlockDeleteButton")
    
        selectorsNodes.forEach(function(selector){
            const primaryClass = Array.from(selector.classList)[0];
            
            const selectionNew = selectorNodes[`${primaryClass}`].cloneNode(true);
            selectionNew.addEventListener("change", publishSelectionValueChange)
    
            selectionNew.value = timeBlock[primaryClass]; 
            const selectedOption = selectionNew.querySelector(`option[value = ${selectionNew.value}]`);
            selectedOption.selected = true;
            if(selectedOption.value != "default"){
                selectionNew.firstChild.disabled = true;
            }
            
            selector.replaceWith(selectionNew);
    
            function publishSelectionValueChange(){
                const selector = primaryClass
                const value = selectionNew.value;
                events.publish("modifyAdminTimeBlockSelectorValue", {blockNumber, day, selector, value})
            }
        })

        deleteButton.addEventListener("click", deleteAdminTimeBlock);

        return content

        function deleteAdminTimeBlock(){
            events.publish("deleteAdminTimeBlockClicked", {adminTimeBlockDiv, day, blockNumber})
        }


    } 

})()

export {adminMainPageDOM}