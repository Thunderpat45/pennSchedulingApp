import {events} from "../../../events"

const myTeamsOrderFormComponent = (function(){
    
    events.subscribe("teamsOrderChangeRequested", renderAllTeamsOrderForm)
    events.subscribe("teamDataChangesCancelled", unrenderAllTeamsOrderForm);
    events.subscribe('myTeamsOrderChangeSaved', unrenderAllTeamsOrderForm);
    events.subscribe('teamsOrderDataUpdated', populateContent)

    const body = document.querySelector('body')
    const mainPage = document.querySelector('#mainPage')
    const formDivWrapper = document.querySelector("#entryFormDiv")
    const formDiv = document.querySelector("#entryForm");
    const overlayDiv = document.createElement('div');
    overlayDiv.id = 'overlayDiv'

    // function rerenderAllTeamsOrderForm(teamsData){
    //     unrenderAllTeamsOrderForm()
    //     renderAllTeamsOrderForm(teamsData)
    // }

    function renderAllTeamsOrderForm(teamsData){
        
        const elements = setElements();
        populateContent(teamsData, elements);
        setEventListeners(elements, teamsData);
    
        formDiv.appendChild(elements.content);
        mainPage.appendChild(overlayDiv)
        overlayDiv.appendChild(formDivWrapper)

        formDivWrapper.classList.toggle("formHidden");
        elements.form.classList.toggle('toggleScrollBarOn')
        body.style.overflowY = "hidden"

        

    } 

    function unrenderAllTeamsOrderForm(){
        if(formDiv.firstChild){
            while(formDiv.firstChild){
                formDiv.removeChild(formDiv.firstChild)
            }
        }

        formDivWrapper.classList.add("formHidden");
        body.style.overflowY = 'scroll'
        overlayDiv.replaceWith(...overlayDiv.childNodes)
    }
   
    function setElements(){
        const template = document.querySelector("#teamOrderFormTemplate");
        const content = document.importNode(template.content, true);

        const form = content.querySelector('#teamOrderForm')
        const teamList = content.querySelector('#teamOrderFormTeams')
        const saveButton = content.querySelector("#saveTeamOrderButton");
        const cancelButton = content.querySelector("#cancelTeamOrderChangesButton");
    
        return {content, form, teamList, saveButton, cancelButton}
    }

    function populateContent(teamsData, elements = {teamList: document.querySelector('#teamOrderFormTeams'), saveButton: document.querySelector("#saveTeamOrderButton")}){
        if(elements.teamList.firstChild){
            while(elements.teamList.firstChild){
                elements.teamList.removeChild(elements.teamList.firstChild)
            }
        }
        if(teamsData.length >=1){
            teamsData.forEach(function(team){
                const teamTemplate = document.querySelector('#teamOrderFormTeamTemplate');
                const teamContent = document.importNode(teamTemplate.content, true);

                const name = teamContent.querySelector('.teamOrderFormTeamName');
                const size = teamContent.querySelector('.teamOrderFormTeamSize');
                const uprankButton = teamContent.querySelector('.moveOptionUpButton');
                const downrankButton = teamContent.querySelector('.moveOptionDownButton');

                name.innerText = `Team: ${team.name}`;
                size.innerText = `Size: ${team.size}`;

                uprankButton.addEventListener('click', moveTeamRankUp);
                downrankButton.addEventListener('click', moveTeamRankDown);

                if(teamsData.length > 1 && team.rank.myTeams== 0){
                    uprankButton.remove()
                }else if(teamsData.length > 1 && team.rank.myTeams == teamsData.length-1){
                    downrankButton.remove()
                }else if(teamsData.length ==1){
                    uprankButton.remove();
                    downrankButton.remove();
                }

                elements.teamList.appendChild(teamContent)

                function moveTeamRankUp(){
                    events.publish('modifyMyTeamsOrderClicked', {team: team, modifier: -1})
                }
                function moveTeamRankDown(){
                    events.publish('modifyMyTeamsOrderClicked', {team: team, modifier: 1})
                }
            })
        }else{
            elements.teamList.innerText = 'No teams here!'
            elements.saveButton.disabled = true;
        }
    }

    function setEventListeners(elements){       
        elements.saveButton.addEventListener("click", saveTeamOrderData);
        elements.cancelButton.addEventListener("click", cancelTeamOrderChanges);

        function saveTeamOrderData(){
            events.publish("updateTeamOrderClicked")      
        }
        function cancelTeamOrderChanges(){
           events.publish("cancelTeamOrderChangesClicked")
        }
    }
})();

export{myTeamsOrderFormComponent}