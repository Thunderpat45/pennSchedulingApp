import { events } from "../events"
import { timeValueConverter } from "../timeConverter";

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
            coach, //needs a source of data, work on that
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
        {day: [{start, stop}, {start, stop}], day: [{start, stop}, {start, stop}]}, all days already input, make sure empties don't screw anything up

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
    facilityData changes, save requests, and change cancellations FOR adminMainPageFacilityDataModel
    

subscribes to: 
    adminMainPageModel builds FROM adminMainPageModel
    adminSelectorsBuilt FROM selectorDOMBuilder
    adminAvailability and adminFacility model updates FROM adminAvailabity and adminFacility data models
*/

EDIT NOTES ABOVE THEN BEGIN REVIEW OF THIS AND ALL DATA MODELS
/*

actions: mainPage interface for reviewing and requesting modifications to availability and myTeams data

publishes:
    request to render mainPage
    set season requests
    request to fetch availabilityData
    request to fetch myTeamsData for edits/deletes/order modification
    request to generate workingModel for new team

subscribes to: 
    requests to generate mainPageDOM


*/

const mainPageDOM = (function(){

    let season; //figure this out
    
    events.subscribe("mainPageModelBuilt", publishMainPageRender);

    function publishMainPageRender(mainPageData){
        const mainPageDOM = buildMainPageDOM(mainPageData)
        events.publish("pageRenderRequested", mainPageDOM)
    }

    
    function buildMainPageDOM(mainPageData){ 
        const template = document.querySelector("#mainPageTemplate");
        const content = document.importNode(template.content, true);
        const mainPageAvailability = content.querySelector("userAvailability");
        const mainPageMyTeams = content.querySelector("teamGridContainer");
        const fallButton = content.querySelector("#fallButton");
        const springButton = content.querySelector("#springButton");

        const mainPageAvailabilityNew = renderMainPageAvailability(mainPageAvailability, mainPageData.availability);
        const mainPageMyTeamsNew = renderMainPageMyTeams(mainPageMyTeams, mainPageData.myTeams); 
        
        mainPageAvailability.replaceWith(mainPageAvailabilityNew);
        mainPageMyTeams.replaceWith(mainPageMyTeamsNew);

        fallButton.addEventListener("click", setSeasonFall);
        springButton.addEventListener("click", setSeasonSpring); //deactivate button of current season

        return content

        function setSeasonFall(){ //is this all
            events.publish("setSeasonFall")
        }

        function setSeasonSpring(){ //is this all
            events.publish("setSeasonSpring")
        }
    }

    function renderMainPageAvailability(availabilityDOM, availability){
        const availabilityDisplay = availabilityDOM.querySelector("#availabilityDisplay");
        const editAvailability = availabilityDOM.querySelector("#editAvailability");

        const availabilityDisplayNew = buildAvailabilityDisplay(availability);
        availabilityDisplay.replaceWith(availabilityDisplayNew);

        editAvailability.addEventListener("click", getAvailabilityModel);

        return availabilityDOM
        
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

    function renderMainPageMyTeams(teamsDOM, teamArray){
        
        const teamGrid = teamsDOM.querySelector("#teamGrid"); 
        const addButton = teamsDOM.querySelector("#teamGridAddTeam");

        const teamArraySlice = teamArray.concat(); 
    
        teamArraySlice.forEach(function(team){
            const teamDOM = buildTeam(team, teamArraySlice); 
            teamGrid.appendChild(teamDOM)
        })

        addButton.addEventListener("click", addTeam);
        
        return teamsDOM
        
            
        function addTeam(){
            events.publish("addTeam")
        }
    }

    function buildTeam(team, teamArraySlice){
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

        if(teamArraySlice.length >1 && team.rank.myTeamIndex != 0){
            const upButton = document.createElement("button"); //up icon if possible, set class and CSS
            upButton.addEventListener("click", moveMyTeamUp);//
            content.insertBefore(upButton, editButton);
       }else if(teamArraySlice.length >1 && team.rank.myTeamIndex != teamArraySlice.length-1){
            const downButton = document.createElement("button"); //up icon if possible, set class and CSS
            downButton.addEventListener("click", moveMyTeamDown);//
            content.insertBefore(downButton, editButton);
       }

        editButton.addEventListener("click", editTeam);
        deleteButton.addEventListener("click", deleteTeam);

        return content

        function editTeam(){ 
            events.publish("editTeam", team); 
        }
    
        function deleteTeam(){
            events.publish("deleteTeam", team);
        }

        function moveMyTeamUp(){
            events.publish("modifyMyTeamOrder", {index: team.rank.myTeamIndex, modifier:-1});
        }

        function moveMyTeamDown(){
            events.publish("modifyMyTeamOrder", {index: team.rank.myTeamIndex, modifier:1});
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