import { events } from "../events";

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
    events.subscribe("adminMainPageModelBuilt", publishAdminMainPageRender);
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
                    return;
            }	
        }
    }
    
    function setSeason(adminMainPageData){ //make sure this happens before publishAdminMainPageRender, it should
        season = adminMainPageData.season
    }

    function publishAdminMainPageRender(adminMainPageData){
        const adminMainPageDOM = buildAdminMainPageDOM(adminMainPageData);
        events.publish("pageRenderRequested", adminMainPageDOM);
    }
    //find subscribers to changeSeasons and runScheduler, issue NOT TO BE ADDRESSED:  scheduler could be run with unsaved modifications to adminAvail and facilityData
    function buildAdminMainPageDOM(adminMainPageData){
        const template = document.querySelector("#adminMainPageTemplate");
        const content = document.importNode(template.content, true);
        
        const seasonButtons = content.querySelector("#adminSeasonButtons");
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
    
        seasonButtons.children.forEach(function(child){
            if(child.id == `${season}Button`){
                child.disabled = true;
            }else{
                child.addEventListener("click", changeSeason)
               
            }
        })

        schedulerButton.addEventListener("click", runScheduler)
    
        return content
    
        function changeSeason(){
            let string = "Button";
            const seasonButtonId = this.id;
            const truncateIndex = seasonButtonId.indexOf(string);
            const seasonName = seasonButtonId.slice(0, truncateIndex);
            
            events.publish("adminSeasonChangeRequested", seasonName)
        }

        function runScheduler(){
            events.publish("runSchedulerRequested") 
        }
    }
    //no obvious issues with this or allTeamsData
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

    //adminTeamRow display is: teamName, coach, lastVerified, teamRank, up and downrank buttons
    function buildAdminTeamRow(teamData, allTeamsData){ //after viewing full page, determine whether to add allOpts for admin viewing
        const template = document.querySelector("#adminMainPageTeamTemplate");
        const content = document.importNode(template.content, true);
    
        const teamName = content.querySelector(".adminMainPageTeamGridTeamName");
        const teamCoach = content.querySelector(".adminMainPageTeamGridTeamCoach");
        const teamSize = content.querySelector(".adminMainPageTeamGridTeamSize");
        const teamRank = content.querySelector(".adminMainPageTeamGridTeamRank");
        const teamButtons = content.querySelector(".adminMainPageTeamGridTeamsButtons");
        
        const uprankButton = document.createElement("button");
        const downrankButton = document.createElement("button");

        teamName.innerText = teamData.teamName;
        teamCoach.innerText = teamData.coach;
        teamSize.innerText = teamData.teamSize;
        teamRank.innerText = teamData.rank.allTeams;

        uprankButton.id = "adminMainPageTeamGridTeamUprankButton"
        downrankButton.id = "adminMainPageTeamGridTeamDownrankButton"
    
        uprankButton.addEventListener("click", moveAdminRankUp);
        downrankButton.addEventListener("click", moveAdminRankDown);
    
        if(allTeamsData.length > 1 && teamData.rank.allTeams != 0 && teamData.rank.allTeams != allTeamsData.length - 1){
            teamButtons.appendChild(uprankButton);
            teamButtons.appendChild(downrankButton);
        }else if(allTeamsData.length > 1 && teamData.rank.allTeams == allTeamsData.length - 1){
            teamButtons.appendChild(uprankButton)
        }else if(allTeamsData.length > 1 && teamData.rank.allTeams == 0){
            teamButtons.appendChild(downrankButton)
        }   
    
        return content
    
        function moveAdminRankUp(){ 
            events.publish("modifyAdminTeamOrder", {index: teamData.rank.allTeams, modifier: -1})
        }
        function moveAdminRankDown(){
            events.publish("modifyAdminTeamOrder", {index: teamData.rank.allTeams, modifier: 1})
        }
    }
    //no obvious issues with this or dataModel, display is usersGrid and addUserButton
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
    //userRow display is: name, privilegeLevel, color, lastVerified date, edit and deleteButtons
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
    function renderFacilityDataGrid(dataDomObj){
        
        const adminFacilityDataContainer = dataDomObj.adminFacilityDataContainer;
        const adminMainPageData = dataDomObj.adminMainPageData;

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
    
            const selectedOption = selectionNew.querySelector(`option[value = ${adminMainPageData[primaryClass]}]`);
            selectedOption.selected = true;
            if(selectedOption.value != "default"){
                selectionNew.firstChild.disabled = true;
            }
            
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
            events.publish("updateFacilityDataClicked");
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
    
    //adminTimeBlocker display is blockGrid (allTimeBlocks), saveChanges, cancelChanges buttons; dataModel issue to determine when to write changes to allUsers (FE or BE)
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
            events.publish("updateAdminAvailabilityClicked")
        }
        function cancelAdminAvailabilityChanges(){
            events.publish("cancelAdminAvailabilityChangesClicked", adminTimeBlockDiv)
        }
    }
    //allTimeBlocks display is forEach day (Day Label, addButton, [row for each timeBlock])
    function renderAdminAllTimeBlocks(dataDomObj){
        const adminTimeBlockDiv = dataDomObj.adminTimeBlockDiv;
        const adminMainPageData = dataDomObj.adminMainPageData
        const allTimeBlocksNew = document.createElement("div")
        allTimeBlocksNew.id = "adminMainPageAddAvailabilityBlockAllUsersGrid";
    
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

            allTimeBlocksNew.appendChild(day);

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
    
            const selectedOption = selectionNew.querySelector(`option[value = ${timeBlock[primaryClass]}]`);
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