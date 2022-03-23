import { events } from "../../../events";
import {timeValueConverter} from "../../../timeConverter";

const myTeamsDataGridComponent = (function(){

    events.subscribe("renderUpdatedMyTeamsData", renderMyTeams)

    function renderMyTeams(teamData){

        const teamGrid = document.querySelector("#teamGrid");
        const teamGridNew = document.createElement("div");
        teamGridNew.id = "teamGrid";

        if(teamData.length > 0){
            teamData.forEach(function(team){
                const teamRow = buildTeamRow(team);
                teamGridNew.appendChild(teamRow);
            })
        }else{
            const p = document.createElement('p');
            p.innerText = 'You have no teams listed!'
            teamGridNew.appendChild(p) 
        }

        teamGrid.replaceWith(teamGridNew); 
    }

    function buildTeamRow(teamData){   
        const elements = setTemplateElements();
        setElementsContent(elements, teamData);
        setEventListeners(elements, teamData)

        return elements.content  
    }

    function setTemplateElements(){
        const template = document.querySelector("#userPageTeamBlockTemplate");
        const content = document.importNode(template.content, true);

        const div = content.querySelector(".teamGridTeam")

        const name = content.querySelector(".teamGridTeamName");
        const size = content.querySelector(".teamGridTeamSize");
        const lastVerified = content.querySelector(".teamGridTeamLastVerified");
        const optionContainer = content.querySelector(".teamGridTeamOptionContainer");
        const verifyButton = content.querySelector('.teamGridTeamVerifyButton')
        const editButton = content.querySelector('.teamGridTeamEditButton')
        const deleteButton = content.querySelector('.teamGridTeamDeleteButton')


        return {content, div, name, size, lastVerified, optionContainer, editButton, deleteButton, verifyButton}
    }

    function setElementsContent(teamElement, teamData){
        teamElement.div.setAttribute("data-teamId", teamData._id)
        teamElement.name.innerText = `${teamData.name}`;
        teamElement.size.innerText = `Size: ${teamData.size}`;
        teamElement.lastVerified.innerText = `Last Verified: ${teamData.lastVerified}`; //fix this for undefined case
        
        teamData.allOpts.forEach(function(option){
            const optionTemplate = document.querySelector("#userPageTeamOptionBlockTemplate");
            const optContent = document.importNode(optionTemplate.content, true);

            const optNumDiv = optContent.querySelector(".teamGridTeamOptionNumber")
            optNumDiv.innerText = `Option ${teamData.allOpts.indexOf(option) + 1}`
            
            const dayContainer = optContent.querySelector(".teamGridTeamDayContainer");
            option.forEach(function(day){
                const dayTemplate = document.querySelector('#userPageTeamDayBlockTemplate')
                const dayContent = document.importNode(dayTemplate.content, true);

                const dayOfWeek = dayContent.querySelector('.teamGridTeamDayOfWeek');
                const startTime = dayContent.querySelector('.teamGridTeamStartTime');
                const endTime = dayContent.querySelector('.teamGridTeamEndTime');
                const inWeiss = dayContent.querySelector('.teamGridTeamInWeiss');

                dayOfWeek.innerText = `${day.dayOfWeek}`;
                startTime.innerText = `${timeValueConverter.runConvertTotalMinutesToTime(day.startTime)}`;
                endTime.innerText = `${timeValueConverter.runConvertTotalMinutesToTime(day.endTime)}`;
                inWeiss.innerText = `${day.inWeiss}`;

                dayContainer.appendChild(dayContent)
            })
            teamElement.optionContainer.appendChild(optContent)
        })
    }

    function setEventListeners(teamElement, teamData){
        teamElement.editButton.addEventListener("click", editTeam);
        teamElement.deleteButton.addEventListener("click", deleteTeam);
        teamElement.verifyButton.addEventListener("click", verifyTeam)

        function editTeam(){
            events.publish('editTeamClicked', teamData._id)
        }

        function deleteTeam(){
            const confirmation = confirm('Delete this team?');
            if(confirmation){
                events.publish('deleteTeamClicked', teamData._id)
            }
        }

        function verifyTeam(){
            events.publish('verifyTeamClicked', teamData._id)
        }
    }
})()

export {myTeamsDataGridComponent}