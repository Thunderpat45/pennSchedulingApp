const events = [] //to shut the linter up until events.js can be imported;
//check other modules for schedulePreferences vs allOpts
/*
actions: renders DOM for myTeams data, posts requests for addition/deletion/edits of teamRequests

publishes:

subscribes to:
*/

const mainPageMyTeamsDOM = (function(){

    function renderMyTeams(teamArray){
        const teamGrid = document.querySelector("#teamGrid"); //document or content qS?

        teamArray.forEach(function(team){
            const teamIndex = teamArray.indexOf(team);
            const teamDOM = buildTeam(team, teamIndex);
            teamGrid.appendChild(teamDOM)
        })

    }

    function buildTeam(teamRequest, teamIndex){
        const template = document.querySelector("#homePageTeamTemplate");
        const content = document.importNode(template.content, true);
        const teamName = content. querySelector(".teamGridTeamName");
        const teamSize = content. querySelector(".teamGridTeamSize");
        const optionContainer = content. querySelector(".teamGridTeamOptionContainer");
        const editButton = content. querySelector(".teamGridTeamEditButton");
        const deleteButton = content. querySelector(".teamGridTeamDeleteButton");
        //team up and down buttons;

        teamName.innerText = teamRequest.teamName;
        teamSize.innerText = teamRequest.teamSize;

        teamRequest.allOpts.forEach(function(optionDetails){
            const optNum = teamRequest.allOpts.indexOf(optionDetails)+1;
            const option = buildTeamOption(optionDetails, optNum);
            optionContainer.appendChild(option);
        })

        
        editButton.addEventListener();// add Event Listeners!
        deleteButton.addEventListener();//
       /*
        upButton.addEventListener(); //publish (teamIndex, -1)
        downButton.addEventListener(); //publish (teamIndex, 1)
        */

        return content
    }

    function buildTeamOption(optionDetails, optNum){
        const template = document.querySelector("#homePageTeamOptionTemplate");
        const content = document.importNode(template.content, true);
        const option = content. querySelector(".teamGridTeamOption");
        const dayContainer = content. querySelector(".teamGridTeamDayContainer");

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
        startTime.innerText = day.startTime; // converter
        endTime.innerText = day.endTime;
        inWeiss.innerText = day.inWeiss;

        return content
    }

})()