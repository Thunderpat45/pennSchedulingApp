import {events} from "../events"
import {timeValueConverter} from "../timeConverter";
/*
actions: renders DOM for myTeams data, posts requests for addition/deletion/edits of teamRequests

publishes:
    addTeamRequest
    editTeamRequest
    deleteTeamRequest
    changeTeamOrderRequest

subscribes to:
    teamArrayUpdated
        from: allTeamsList
    renderRequest
        from: (part of homePage render??)
*/

const mainPageMyTeamsDOM = (function(){

    events.subscribe("allTeamsLoaded", renderMyTeams)
    events.subscribe("teamOrderModified", renderMyTeams) //both accomplish same thing, do they need different publish tags?


    function renderMyTeams(teamArray){
        const template = document.querySelector("homePageTeamGridTemplate");
        const content = document.importNode(template.content, true);
        const teamGrid = content.querySelector("#teamGrid"); 
        const addButton = content.querySelector("#teamGridAddTeam");

        teamArray.forEach(function(team){
            const teamIndex = teamArray.indexOf(team);
            const teamDOM = buildTeam(team, teamIndex);
            teamGrid.appendChild(teamDOM)
        })

        addButton.addEventListener("click", addTeam);

        const teamGridContainer = document.querySelector("#teamGridContainer");
        if(teamGridContainer != null){
            teamGridContainer.replaceWith(content);
        }
        else{
            return content
        }
            
        function addTeam(){
            events.publish("addTeam")
        }
    }

    function buildTeam(team, teamIndex){
        const template = document.querySelector("#homePageTeamTemplate");
        const content = document.importNode(template.content, true);
        const teamName = content.querySelector(".teamGridTeamName");
        const teamSize = content.querySelector(".teamGridTeamSize");
        const optionContainer = content.querySelector(".teamGridTeamOptionContainer");
        const editButton = content.querySelector(".teamGridTeamEditButton");
        const deleteButton = content.querySelector(".teamGridTeamDeleteButton");
        //team up and down buttons;

        teamName.innerText = team.teamName;
        teamSize.innerText = team.teamSize;

        team.allOpts.forEach(function(optionDetails){
            const optNum = team.allOpts.indexOf(optionDetails)+1;
            const option = buildTeamOption(optionDetails, optNum);
            optionContainer.appendChild(option);
        })

        
        editButton.addEventListener(editTeam);
        deleteButton.addEventListener(deleteTeam);
       /*
        upButton.addEventListener(); //publish (teamIndex, -1)
        downButton.addEventListener(); //publish (teamIndex, 1)
        */

        return content

        function editTeam(){
            events.publish("editTeam", team.teamName);
        }
    
        function deleteTeam(){
            events.publish("deleteTeam", team.teamName);
        }
    }

    function buildTeamOption(optionDetails, optNum){
        const template = document.querySelector("#homePageTeamOptionTemplate");
        const content = document.importNode(template.content, true);
        const option = content.querySelector(".teamGridTeamOption");
        const dayContainer = content.querySelector(".teamGridTeamDayContainer");

        option.innerText = `Option ${optNum}`;

        optionDetails.forEach(function(day){
            const dayDetails = buildTeamDayDetails(day);
            dayContainer.appendChild(dayDetails);
        })
        
        return content
    }
    
    function buildTeamDayDetails(day){
        const template = document.querySelector("#homePageTeamDayTemplate");
        const content = document.importNode(template.content, true);
        const dayOfWeek = content.querySelector(".teamGridTeamDayOfWeek");
        const startTime = content.querySelector(".teamGridTeamStartTime");
        const endTime = content.querySelector(".teamGridTeamEndTime");
        const inWeiss = content.querySelector(".teamGridTeamInWeiss");

        dayOfWeek.innerText = day.dayOfWeek;
        startTime.innerText = timeValueConverter.runConvertTotalMinutesToTime(day.startTime).toString();
        endTime.innerText = timeValueConverter.runConvertTotalMinutesToTime(day.endTime).toString();
        inWeiss.innerText = day.inWeiss;

        return content
    }

})();

export{mainPageMyTeamsDOM}