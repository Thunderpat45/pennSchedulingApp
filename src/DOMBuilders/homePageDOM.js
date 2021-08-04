import { events } from "../events"
import { timeValueConverter } from "../timeConverter";

const homePageDOM = (function(){

    let season; //figure this out
    
    events.subscribe("dataLoadedFromDatabase", buildHomePageDOM); //check for intermediate steps here; make sure DB load publishes to availabilityModel, change this, this needs to come from both avaiablity and myTeams dataModels
    events.subscribe("teamsDeletedOrderModified", renderHomePageMyTeams);

    function buildHomePageDOM(obj){ //fix these params
        const template = document.querySelector("#homePageTemplate");
        const content = document.importNode(template.content, true);
        const homePageAvailability = content.querySelector("availability");
        const homePageMyTeams = content.querySelector("teamGridContainer");
        const fallButton = content.querySelector("#fallButton");
        const springButton = content.querySelector("#springButton");

        const homePageAvailabilityNew = renderHomePageAvailability(obj.availability);
        const homePageMyTeamsNew = renderHomePageMyTeams(obj.myTeams); //change and find params for each of these
        
        homePageAvailability.replaceWith(homePageAvailabilityNew);
        homePageMyTeams.replaceWith(homePageMyTeamsNew);

        fallButton.addEventListener("click", setSeasonFall);
        springButton.addEventListener("click", setSeasonSpring); //deactivate button of current season

        function setSeasonFall(){ //is this all
            events.publish("setSeasonFall")
        }

        function setSeasonSpring(){ //is this all
            events.publish("setSeasonSpring")
        }
    }

    function renderHomePageAvailability(availability){
        const template = document.querySelector("#userAvailabilityTemplate");
        const content = document.importNode(template.content, true);
        const availabilityDisplay = content.querySelector("#availabilityDisplay");
        const editAvailability = content.querySelector("#editAvailability");

        const availabilityDisplayNew = buildAvailabilityDisplay(availability);
        availabilityDisplay.replaceWith(availabilityDisplayNew);

        editAvailability.addEventListener("click", getAvailabilityModel);

        const userAvailability = document.querySelector("#userAvailability");
        
        if(userAvailability != null){
            userAvailability.replaceWith(content);
            content.id = "userAvailability"
        }else{
            content.id = "userAvailability";
            return content
        }

        function getAvailabilityModel(){
            events.publish("availabilityModelRequested")
        }
    }

    function buildAvailabilityDisplay(availability){
        const availabilityDisplayNew = document.createElement("div");
        for(let day in availability){
            const dayDiv = document.createElement("div");
            const label = document.createElement("h3");

            label.innerText = `${day}`;
            day.forEach(function(timeBlock){
                const timeBlockDiv = document.createElement("div");
                const startTime = document.createElement("p");
                const endTime = document.createElement("p");

                startTime.innerText = `Start Time: ${availability[day][timeBlock].startTime}`;
                endTime.innerText = `End Time: ${availability[day][timeBlock].endTime}`;

                timeBlockDiv.appendChild(startTime);
                timeBlockDiv.appendChild(endTime);
                dayDiv.appendChild(timeBlockDiv)
            })
            availabilityDisplayNew.appendChild(dayDiv)
        }
        return availabilityDisplayNew
    }

    function renderHomePageMyTeams(teamArray){
        const template = document.querySelector("homePageTeamGridTemplate");
        const content = document.importNode(template.content, true);
        const teamGrid = content.querySelector("#teamGrid"); 
        const addButton = content.querySelector("#teamGridAddTeam");

        teamArray.sort(function(a,b){
            return a.rank.myTeamIndex - b.rank.myTeamIndex
        })
        teamArray.forEach(function(team){
            const teamDOM = buildTeam(team, teamArray);
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

    function buildTeam(team, teamArray){
        const template = document.querySelector("#homePageTeamTemplate");
        const content = document.importNode(template.content, true);
        const teamName = content.querySelector(".teamGridTeamName");
        const teamSize = content.querySelector(".teamGridTeamSize");
        const optionContainer = content.querySelector(".teamGridTeamOptionContainer");
        const editButton = content.querySelector(".teamGridTeamEditButton");
        const deleteButton = content.querySelector(".teamGridTeamDeleteButton");


        teamName.innerText = team.teamName;
        teamSize.innerText = team.teamSize;

        team.allOpts.forEach(function(optionDetails){
            const optNum = team.allOpts.indexOf(optionDetails)+1;
            const option = buildTeamOption(optionDetails, optNum);
            optionContainer.appendChild(option);
        })

        if(teamArray.length >1 && team.rank.myTeamIndex !=0){
            const upButton = document.createElement("button"); //up icon if possible, set class and CSS
            upButton.addEventListener("click", moveMyTeamUp);
            content.insertBefore(upButton, editButton);
       }else if(teamArray.length >1 && team.rank.myTeamIndex != teamArray.length-1){
            const downButton = document.createElement("button"); //up icon if possible, set class and CSS
            downButton.addEventListener("click", moveMyTeamDown);
            content.insertBefore(downButton, editButton);
       }

        editButton.addEventListener(editTeam);
        deleteButton.addEventListener(deleteTeam);

        return content

        function editTeam(){
            events.publish("editTeam", team.teamName); //check this for redundancy in myTeamsModel
        }
    
        function deleteTeam(){
            events.publish("deleteTeam", team.teamName); //or just team?
        }

        function moveMyTeamUp(){
            events.publish("modifyMyTeamOrder", {index: team.rank.myTeamIndex, modifier:-1});
        }

        function moveMyTeamDown(){
            events.publish("modifyMyTeamOrder", {index: team.rank.myTeamIndex, modifier:1});
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
})()