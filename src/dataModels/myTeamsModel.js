import {events} from "../events"

/*
actions: stores current userTeams, makes modifications on a copy

publishes: 
    myTeams database updates for :
        teamAdditions
        teamDeletions
        teamEdits
        teamOrder changes
    single teamData for teamRequestModel edits

subscribes to: 
    requests to fetch single team data for edits
    requests to update database with added/edited/deleted/order changed team
*/

const myTeamsModel = (function(){

    let myTeams;

    events.subscribe("editTeam", editTeam)
    events.subscribe("modifyMyTeamOrder", modifyTeamOrder) 
    events.subscribe("mainPageModelBuilt", populateMyTeams)
    events.subscribe("workingModelValidated", addEditTeamForDatabaseUpdate)
    events.subscribe("deleteTeam", deleteTeamForDatabaseUpdate)

     function populateMyTeams(userMyTeams){ 
         myTeams = Object.assign({}, userMyTeams.myTeams) //does this need any more recursive copying?
    }

    function editTeam(teamRequest){ 
        const thisTeam = myTeams.filter(function(team){
            teamRequest.teamName == team.teamName
        })[0];
        events.publish("teamEditDataLoaded", thisTeam);
    }

    function modifyTeamOrder(teamIndex, modifier){
        const myTeamsSlice = myTeams.concat();
        const team = myTeamsSlice.splice(teamIndex, 1)[0];
        myTeamsSlice.splice(teamIndex + modifier, 0, team);
        myTeamsSlice.forEach(function(team){
            team.rank.myTeams = myTeamsSlice.findIndex(function(teams){ //FIND A WAY TO REDUCE THE DUPLICATION OF THIS FINDINDEX FUNCTION
                return teams.teamName = team.teamName
            })
        })     
        events.publish("myTeamsDataUpdated", myTeamsSlice); //send to DB for save? inclined to say yes
    }

    function addEditTeamForDatabaseUpdate(obj){
        const myTeamsSlice = myTeams.concat();
        const existingTeamIndex = findExistingTeam()
        
       if(existingTeamIndex != -1){
            myTeamsSlice.splice(existingTeamIndex, 1, obj.workingModel)
       }else{
            myTeamsSlice.push(obj.workingModel)
       }
       myTeamsSlice.forEach(function(team){
            team.rank.myTeams = myTeamsSlice.findIndex(function(teams){
                return teams.teamName = team.teamName
            })
        })
        events.publish("myTeamsDataUpdated", myTeamsSlice) //send to DB for save

        function findExistingTeam(){
            const existingTeam = myTeamsSlice.findIndex(function(teams){
                return obj.teamRequest.teamName == teams.teamName
            })
            return existingTeam
            
        }
    }

    function deleteTeamForDatabaseUpdate(team){
        const myTeamsSlice = myTeams.concat();
        const existingTeamIndex = myTeamsSlice.findIndex(function(teams){ 
            return teams.teamName = team.teamName
        })

        myTeamsSlice.splice(existingTeamIndex, 1)
        myTeamsSlice.forEach(function(team){
            team.rank.myTeams = myTeamsSlice.findIndex(function(teams){ 
                return teams.teamName = team.teamName
            })
        })
        events.publish("myTeamsDataUpdated", myTeamsSlice)   //send to DB for save
    }


})();

export{myTeamsModel}



