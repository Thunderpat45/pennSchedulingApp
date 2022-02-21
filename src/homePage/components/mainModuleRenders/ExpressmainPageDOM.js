import { events } from "../../../events"
import { timeValueConverter } from "../../../timeConverter";

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
        const seasonButtonsChildren = Array.from(seasonButtons.children)
        const mainPageAvailability = content.querySelector("#userAvailability");
        const mainPageMyTeams = content.querySelector("#teamGridContainer");
        const verifyInfo = content.querySelector("#verifyInfo");
        const verifyButton = content.querySelector("#verifyButton");

        const mainPageAvailabilityNew = renderMainPageAvailability(mainPageAvailability, mainPageData.availability);
        const mainPageMyTeamsNew = renderMainPageMyTeams(mainPageMyTeams, mainPageData.teams); 
        
        mainPageAvailability.replaceWith(mainPageAvailabilityNew);
        mainPageMyTeams.replaceWith(mainPageMyTeamsNew);
        
        if(mainPageData.lastVerified != null){
            verifyInfo.innerText += ` ${mainPageData.lastVerified}`
        }

        
        seasonButtonsChildren.forEach(function(child){
            if(child.id == `${season}Button`){
                child.disabled = true;
            }else{
                child.addEventListener("click", changeSeason)
               
            }
        })

        verifyButton.addEventListener("click", publishTeamsUpToDateVerification);
    
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
        availabilityDisplayNew.id = "availabilityDisplay"
        for(let day in availabilityData){
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("userAvailabilityDay");

            const allBlocksWrapper = document.createElement("div");
            allBlocksWrapper.classList.add("userAvailabilityDayBlockWrapper")

            const label = document.createElement("p");
            label.classList.add("userAvailabilityDayLabel");

            label.innerText = `${day}`;
            dayDiv.appendChild(label)

            availabilityData[day].forEach(function(timeBlock){
                const blockNumber = availabilityData[day].indexOf(timeBlock);
                
                const timeBlockDiv = document.createElement("div");
                timeBlockDiv.classList.add("userAvailabilityTimeBlock")

                const startTime = document.createElement("p");
                const endTime = document.createElement("p");

                startTime.innerText = `Start: ${timeValueConverter.runConvertTotalMinutesToTime(availabilityData[day][blockNumber].startTime)}`;
                endTime.innerText = `End: ${timeValueConverter.runConvertTotalMinutesToTime(availabilityData[day][blockNumber].endTime)}`;

                timeBlockDiv.appendChild(startTime);
                timeBlockDiv.appendChild(endTime);
                allBlocksWrapper.appendChild(timeBlockDiv)
            })
            dayDiv.appendChild(allBlocksWrapper)
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
        const lastVerified = content.querySelector(".teamGridTeamLastVerified");
        const optionContainer = content.querySelector(".teamGridTeamOptionContainer");
        const editButton = content.querySelector(".teamGridTeamEditButton");
        const deleteButton = content.querySelector(".teamGridTeamDeleteButton");
        const verifyButton = content.querySelector(".teamGridTeamVerifyButton");
        const upButton = content.querySelector(".moveOptionUpButton");
        const downButton = content.querySelector(".moveOptionDownButton");

        teamName.innerText = team.name;
        teamSize.innerText = `${team.size} athletes`;
        if(team.lastVerified != null){
            lastVerified.innerText += team.lastVerified
        }

        team.allOpts.forEach(function(optionDetails){
            const optNum = team.allOpts.indexOf(optionDetails)+1;
            const option = buildTeamOption(optionDetails, optNum);
            optionContainer.appendChild(option);
        })

        upButton.addEventListener("click", moveMyTeamUp);
        downButton.addEventListener("click", moveMyTeamDown);

        if(teamArray.length >1 && team.rank.myTeams == teamArray.length-1){
            downButton.remove();
        }else if(teamArray.length >1 && team.rank.myTeams == 0){
            upButton.remove();
        }

        editButton.addEventListener("click", editTeam);
        deleteButton.addEventListener("click", deleteTeam);
        verifyButton.addEventListener("click", verifyTeam)

        return content

        function editTeam(){ 
            events.publish("editTeam", team); //follow these
        }
    
        function deleteTeam(){
            const confirmation = confirm(`Delete ${team.name}?`);
            if(confirmation){
                events.publish("deleteTeam", team);
            }   
        }

        function moveMyTeamUp(){
            events.publish("modifyMyTeamOrder", {index: team.rank.myTeams, modifier:-1});
        }

        function moveMyTeamDown(){
            events.publish("modifyMyTeamOrder", {index: team.rank.myTeams, modifier:1});
        }

        function verifyTeam(){
            events.publish("setTeamVerification", team)
        }
    }

    function buildTeamOption(optionDetails, optNum){
        const template = document.querySelector("#mainPageTeamOptionTemplate");
        const content = document.importNode(template.content, true);

        const optionNumDiv = content.querySelector(".teamGridTeamOptionNumber")
        const dayContainer = content.querySelector(".teamGridTeamDayContainer");

        optionNumDiv.innerText = `Option ${optNum}`;

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