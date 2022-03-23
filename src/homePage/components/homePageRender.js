import {events} from "../../../src/events"

const homeRender = (function(){

    events.subscribe("userDataSet", setHomeEventListeners);
    events.subscribe('allTeamsVerificationSaved', setDataAllTeamsVerified)

    function setHomeEventListeners(){
        setAvailabilityEventListeners();
        setTeamsEventListeners();
    }

    function setTeamsEventListeners(){
        
        const addTeamButton = document.querySelector("#teamGridAddTeam");
        const verifyAllTeamsButton = document.querySelector("#verifyButton");
        const modifyAllTeamsOrderButton = document.querySelector("#modifyMyTeamsOrder")

        const allTeams = Array.from(document.querySelector('#teamGrid').children);

        if(allTeams[0].innerText != "You have no teams listed!"){
            allTeams.forEach(function(team){
                const _id = team.dataset.teamid;
                const editTeamButton = team.querySelector(".teamGridTeamEditButton");
                const deleteTeamButton = team.querySelector(".teamGridTeamDeleteButton");
                const verifyTeamButton = team.querySelector(".teamGridTeamVerifyButton");

                editTeamButton.addEventListener("click", editTeam);
                deleteTeamButton.addEventListener("click", deleteTeam);
                verifyTeamButton.addEventListener("click", verifyTeam);

                function editTeam(){
                    events.publish('editTeamClicked', _id)
                }

                function deleteTeam(){
                    const confirmation = confirm('Delete this team?');
                    if(confirmation){
                        events.publish('deleteTeamClicked', _id)
                    }
                }

                function verifyTeam(){
                    events.publish('verifyTeamClicked', _id)
                }
            })
        }

        addTeamButton.addEventListener("click", addTeam);
        verifyAllTeamsButton.addEventListener("click", verifyAllTeams);
        modifyAllTeamsOrderButton.addEventListener("click", modifyAllTeamsOrder);

        function addTeam(){
            events.publish('addTeamClicked')
        }
        function verifyAllTeams(){
            events.publish('verifyAllTeamsClicked')
        }
        function modifyAllTeamsOrder(){
            events.publish('teamOrderChangeClicked')
        }
    }

    function setAvailabilityEventListeners(){
        const availabilityTimeBlockDays = Array.from(document.querySelector("#userPageAddAvailabilityBlockGrid").children);
    
        availabilityTimeBlockDays.forEach(function(day){
            const dayString = day.querySelector("h3").innerText;
            const addBlockButton = day.querySelector(".userPageAddAvailabilityBlockAddButton");
    
            addBlockButton.addEventListener("click", addTimeBlock);
    
            const dayAllBlocks = Array.from(day.querySelectorAll(".userPageAddAvailabilityAllBlocks > div"));
            if(dayAllBlocks.length > 0 ){
                dayAllBlocks.forEach(function(timeBlock){
                    const _id = timeBlock.dataset.timeblockid
                    const editBlockButton = timeBlock.querySelector(".userPageAddAvailabilityBlockEditButton");
                    const deleteBlockButton = timeBlock.querySelector(".userPageAddAvailabilityBlockDeleteButton")
    
                    if(editBlockButton != null){
                        editBlockButton.addEventListener("click", editTimeBlock);
                        deleteBlockButton.addEventListener("click", deleteTimeBlock);
                    }
                    
    
                    function editTimeBlock(){
                        events.publish("editAvailabilityClicked", {day:dayString, _id})
                    }
    
                    function deleteTimeBlock(){
                        const confirmation = confirm("Delete this time block?");
                        if(confirmation){
                            events.publish("deleteAvailabilityClicked", {day:dayString, _id})
                        }
                    }
                })
            }
    
            function addTimeBlock(){
                events.publish("addAvailabilityTimeBlockClicked", dayString)
            }
        })
    }

    function setDataAllTeamsVerified(timeData){
        const lastVerifiedContent = document.querySelector('#verifyInfo');
        lastVerifiedContent.innerText = `The last time you verified all teams were up-to-date was: ${timeData}`;
    }

})()

export {homeRender}
