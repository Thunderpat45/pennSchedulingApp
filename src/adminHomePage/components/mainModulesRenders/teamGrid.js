import { events } from "../../../../src/events";

const adminTeamsGridComponent = (function(){

    events.subscribe('modifyTeamGrid', renderAdminTeams)

    function renderAdminTeams(allTeamsData){ 
        const teamsDiv = document.querySelector("#adminMainPageTeamGrid");
        const teamsDivNew = document.createElement("div")
        teamsDivNew.id = "adminMainPageTeamGrid"

        allTeamsData.forEach(function(team){
            const teamRow = buildTeamRow(team);
            teamsDivNew.appendChild(teamRow);
        })

        teamsDiv.replaceWith(teamsDivNew);
    }

    function buildTeamRow(teamData){ 
        const elements = setTemplateElements()
        setElementsContent(elements, teamData);
        setEventListeners(elements, teamData);

        if(teamData.enabled == false){ //check this out
            elements.div.classList.toggle('toggleDisable');
            elements.disableButton.innerText = "Enable"      
        }

        return elements.content 
    }

    function setTemplateElements(){
        const template = document.querySelector("#adminMainPageTeamTemplate");
        const content = document.importNode(template.content, true);

        const div = content.querySelector(".adminMainPageTeamGridTeam")
        
        const name = content.querySelector(".adminMainPageTeamGridTeamName");
        const coach = content.querySelector(".adminMainPageTeamGridTeamCoach");
        const size = content.querySelector(".adminMainPageTeamGridTeamSize");
        const rank = content.querySelector(".adminMainPageTeamGridTeamRank");

        const disableButton = content.querySelector(".adminMainPageTeamGridTeamDisableButton");

        return {content, div, name, coach, size, rank, disableButton}
    }

    function setElementsContent(teamElement, teamData){
        teamElement.div.setAttribute("data-teamId", teamData._id)
        teamElement.name.innerText = teamData.name;
        teamElement.coach.innerText = teamData.coach.name;
        teamElement.size.innerText = `${teamData.size}`;
        teamElement.rank.innerText = teamData.rank.allTeams +1;
    }

    function setEventListeners(teamElement, teamData){
        
        const {_id} = teamData

        teamElement.disableButton.addEventListener("click", toggleDisable);

        function toggleDisable(){
            events.publish("enabledStatusChangeClicked", _id)
        }
    }
})()

export {adminTeamsGridComponent}