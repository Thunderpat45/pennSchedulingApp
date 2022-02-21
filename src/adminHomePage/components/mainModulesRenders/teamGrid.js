import { events } from "../../events";

function renderAdminTeams(allTeamsData){ 
    const teamsDiv = document.querySelector("#adminMainPageTeamGrid");
    const teamsDivNew = document.createElement("div")
    teamsDivNew.id = "adminMainPageTeamGrid"

    allTeamsData.forEach(function(team){
        const teamRow = buildTeamRow(team, allTeamsData);
        teamsDivNew.appendChild(teamRow);
    })

    teamsDiv.replaceWith(teamsDivNew);
}

function buildTeamRow(teamData, allTeamsData){ 
    const elements = setTemplateElements()
    setElementsContent(elements, teamData);
    setEventListeners(elements, teamData);
    
    if(allTeamsData.length > 1 && teamData.rank.allTeams == allTeamsData.length - 1){
        elements.downrankButton.remove()
    }else if(allTeamsData.length > 1 && teamData.rank.allTeams == 0){
        elements.uprankButton.remove()
    }else if(allTeamsData.length == 1){
        elements.downrankButton.remove()
        elements.uprankButton.remove()
    }   

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
    
    const uprankButton = content.querySelector(".adminMainPageTeamGridTeamUprankButton");
    const downrankButton = content.querySelector(".adminMainPageTeamGridTeamDownrankButton");
    const disableButton = content.querySelector(".adminMainPageTeamGridTeamDisableButton");

    return {content, div, name, coach, size, rank, uprankButton, downrankButton, disableButton}
}

function setElementsContent(teamElement, teamData){
    teamElement.div.setAttribute("data-teamId", teamData._id)
    teamElement.name.innerText = teamData.name;
    teamElement.coach.innerText = teamData.coach;
    teamElement.size.innerText = `${teamData.size} athletes`;
    teamElement.rank.innerText = teamData.rank.allTeams +1;
}

function setEventListeners(teamElement, teamData){

    const index = teamData.rank.allTeams;
    const {_id} = teamData

    teamElement.uprank.addEventListener("click", moveAdminRankUp);
    teamElement.downrankButton.addEventListener("click", moveAdminRankDown);
    teamElement.disableButton.addEventListener("click", toggleDisable);

    function moveAdminRankUp(){ 
        events.publish("modifyAdminTeamOrder", {index, modifier: -1})
    }

    function moveAdminRankDown(){
        events.publish("modifyAdminTeamOrder", {index, modifier: 1})
    }

    function toggleDisable(){
        events.publish("modifyTeamEnabled", {index, _id})
    }
}

export {renderAdminTeams}