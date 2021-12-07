import { events } from "../events"
import { timeValueConverter } from "../timeConverter";

/*action: user interface for observing teams and availability

userMainPageData object is modeled as such:

obj = {
    name,
    myTeams: 
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

    availability:
        {day: [{start, stop}, {start, stop}], day: [{start, stop}, {start, stop}]}, all days already input, make sure empties don't screw anything up

    season,
    lastVerified,
}

publishes:
    page render requests FOR pageRenderer
    season change requests FOR (?)
    add team requests FOR teamRequestModel
    edit/delete/modify team order requests FOR myTeamsModel
    

subscribes to: 
    userMainPageModel builds FROM mainPageModel
    
*/

const mainPageDOM = (function(){
    
    let season; 
    
    events.subscribe("mainPageModelBuilt", setSeason)
    events.subscribe("mainPageModelBuilt", publishMainPageRender);

    function setSeason(mainPageData){ //make sure this happens before publishMainPageRender, it should
        season = mainPageData.season
    }

    function publishMainPageRender(mainPageData){
        const mainPageDOM = buildMainPageDOM(mainPageData)
        events.publish("pageRenderRequested", mainPageDOM)
    }
    //find database subscribers for changeSeason/verifyUpToDate
    function buildMainPageDOM(mainPageData){ 
        const template = document.querySelector("#mainPageTemplate");
        const content = document.importNode(template.content, true);

        const seasonButtons = content.querySelector("#seasonButtons");
        const mainPageAvailability = content.querySelector("#userAvailability");
        const mainPageMyTeams = content.querySelector("#teamGridContainer");
        const verifyInfo = content.querySelector("#verifyInfo");
        const verifyButton = content.querySelector("#verifyButton");

        const mainPageAvailabilityNew = renderMainPageAvailability(mainPageAvailability, mainPageData.availability);
        const mainPageMyTeamsNew = renderMainPageMyTeams(mainPageMyTeams, mainPageData.myTeams); 
        
        mainPageAvailability.replaceWith(mainPageAvailabilityNew);
        mainPageMyTeams.replaceWith(mainPageMyTeamsNew);
        
        verifyInfo.innerText = `The last time you verified all teams were up-to-date was ${mainPageData.lastVerified}`

        seasonButtons.children.forEach(function(child){
            if(child.id == `${season}Button`){
                child.disabled = true;
            }else{
                child.addEventListener("click", changeSeason)
               
            }
        })

        verifyButton.addEventListner("click", publishTeamsUpToDateVerification);
    
        return content
    
        function changeSeason(){
            let string = "Button";
            const seasonButtonId = this.id;
            const truncateIndex = seasonButtonId.indexOf(string);
            const seasonName = seasonButtonId.slice(0, truncateIndex);
            
            events.publish("userSeasonChangeRequested", seasonName) 
        }

        function publishTeamsUpToDateVerification(){
            const date = new Date().toLocaleString();
            
            events.publish("verifyUpToDateClicked", date)
        }
    }
    //no obvious issues here or with dataModel or availabilityDOM
    function renderMainPageAvailability(availabilityDOM, availabilityData){
        const availabilityDisplay = availabilityDOM.querySelector("#availabilityDisplay");
        const editAvailability = availabilityDOM.querySelector("#editAvailability");

        const availabilityDisplayNew = buildAvailabilityDisplay(availabilityData);
        availabilityDisplay.replaceWith(availabilityDisplayNew);

        editAvailability.addEventListener("click", getAvailabilityModel);

        return availabilityDOM
        
        function getAvailabilityModel(){
            events.publish("availabilityModelRequested")
        }
    }

    function buildAvailabilityDisplay(availabilityData){
        const availabilityDisplayNew = document.createElement("div");
        for(let day in availabilityData){
            const dayDiv = document.createElement("div");
            const label = document.createElement("h3");

            label.innerText = `${day}`;
            day.forEach(function(timeBlock){
                const timeBlockDiv = document.createElement("div");
                const startTime = document.createElement("p");
                const endTime = document.createElement("p");

                startTime.innerText = `Start Time: ${availabilityData[day][timeBlock].startTime}`;
                endTime.innerText = `End Time: ${availabilityData[day][timeBlock].endTime}`;

                timeBlockDiv.appendChild(startTime);
                timeBlockDiv.appendChild(endTime);
                dayDiv.appendChild(timeBlockDiv)
            })
            availabilityDisplayNew.appendChild(dayDiv)
        }
        return availabilityDisplayNew
    }

    function renderMainPageMyTeams(teamsDOM, teamArray){
        
        const teamGrid = teamsDOM.querySelector("#teamGrid"); 
        const addButton = teamsDOM.querySelector("#teamGridAddTeam");
    
        teamArray.forEach(function(team){
            const teamElement = buildTeam(team, teamArray); 
            teamGrid.appendChild(teamElement)
        })

        addButton.addEventListener("click", addTeam); //follow this
        
        return teamsDOM
        
        function addTeam(){
            events.publish("addTeam")
        }
    }

    //set CSS/class values for up/down buttons
    function buildTeam(team, teamArray){
        const template = document.querySelector("#mainPageTeamTemplate");
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

        const upButton = document.createElement("button");
        const downButton = document.createElement("button");

        if(teamArray.length >1 && team.rank.myTeams != 0 && team.rank.myTeams != teamArray.length -1){
            upButton.addEventListener("click", moveMyTeamUp);
            downButton.addEventListener("click", moveMyTeamDown);
            
            content.insertBefore(upButton, editButton);
            content.insertBefore(downButton, editButton);
        }else if(teamArray.length >1 && team.rank.myTeams == teamArray.length-1){
            upButton.addEventListener("click", moveMyTeamUp);
            
            content.insertBefore(upButton, editButton);
        }else if(teamArray.length >1 && team.rank.myTeams == 0){
            downButton.addEventListener("click", moveMyTeamDown);
            
            content.insertBefore(downButton, editButton);
        }

        editButton.addEventListener("click", editTeam);
        deleteButton.addEventListener("click", deleteTeam);

        return content

        function editTeam(){ 
            events.publish("editTeam", team); //follow these
        }
    
        function deleteTeam(){
            events.publish("deleteTeam", team);
        }

        function moveMyTeamUp(){
            events.publish("modifyMyTeamOrder", {index: team.rank.myTeams, modifier:-1});
        }

        function moveMyTeamDown(){
            events.publish("modifyMyTeamOrder", {index: team.rank.myTeams, modifier:1});
        }
    }

    function buildTeamOption(optionDetails, optNum){
        const template = document.querySelector("#mainPageTeamOptionTemplate");
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
        const template = document.querySelector("#mainPageTeamDayTemplate");
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

export {mainPageDOM}