import {events} from "../events"

/*purpose: dataModel for loading content and editing content for array of all user's teams

myTeams object is modeled as such:

obj = {
    myTeams: 
        [
            { 
            teamName,
            teamSize, 
            rank:
                {
                    myTeams,
                    allTeams
                },
            allOpts: [[{dayOfWeek, startTime, endTime, inWeiss}, {etc}], [{etc}, {etc}], []],
            coach
            }, 
            {etc}, 
            {etc}
        ]
}

publishes:
    singleTeam to-edit data FOR teamRequestModel
    save change request FOR database

subscribes to: 
    myTeams data FROM mainPageDataModel
    myTeams order modifications FROM mainPageDOM
    requests to edit/delete teams FROM mainPage DOM
    successful validations from requestValidator
*/

const myTeamsModel = (function(){
    // find subscribers for database updates (teamOrder, validatedTeamDataChanges, deletions)
    let myTeams;

    events.subscribe("editTeam", editTeam)
    events.subscribe("modifyMyTeamOrder", modifyTeamOrder) 
    events.subscribe("mainPageModelBuilt", populateMyTeams)
    events.subscribe("workingModelValidated", addEditTeamForDatabaseUpdate)
    events.subscribe("deleteTeam", deleteTeamForDatabaseUpdate)

     function populateMyTeams(userMyTeams){ 
         myTeams = userMyTeams.teams.concat();
         for(let team in userMyTeams.team){
			myTeams[team] = Object.assign({}, userMyTeams.teams[team])
			myTeams[team].rank = Object.assign({}, userMyTeams.teams[team].rank)
		} 
    }

    function editTeam(teamRequest){ 
        const thisTeam = myTeams.filter(function(team){
            teamRequest.teamName == team.teamName
        })[0];
        events.publish("teamEditDataLoaded", thisTeam); //follow this
    }

    function modifyTeamOrder(teamInfoObj){
        const myTeamsSlice = myTeams.concat();
        const team = myTeamsSlice.splice(teamInfoObj.teamIndex, 1)[0];
        myTeamsSlice.splice(teamInfoObj.teamIndex + teamInfoObj.modifier, 0, team);
        myTeamsSlice.forEach(function(thisTeam){
            thisTeam.rank.myTeams = myTeamsSlice.findIndex(function(teams){
                return teams.teamName == thisTeam.teamName
            })
        })     
        events.publish("myTeamsDataUpdated", myTeamsSlice); //send to DB for save
    }

    function addEditTeamForDatabaseUpdate(teamObject){
        const myTeamsSlice = myTeams.concat();
        const existingTeamIndex = findExistingTeam()
        
       if(existingTeamIndex != -1){
            myTeamsSlice.splice(existingTeamIndex, 1, teamObject.workingModel)
       }else{
            myTeamsSlice.push(teamObject.workingModel)
       }
       myTeamsSlice.forEach(function(thisTeam){
        thisTeam.rank.myTeams = myTeamsSlice.findIndex(function(teams){
                return teams.teamName == thisTeam.teamName
            })
        })
        events.publish("myTeamsDataUpdated", myTeamsSlice) //send to DB for save

        function findExistingTeam(){
            const existingTeam = myTeamsSlice.findIndex(function(teams){
                return teamObject.teamRequest.teamName == teams.teamName
            })
            return existingTeam
            
        }
    }

    function deleteTeamForDatabaseUpdate(thisTeam){
        const myTeamsSlice = myTeams.concat();
        const existingTeamIndex = myTeamsSlice.findIndex(function(teams){ 
            return teams.teamName == thisTeam.teamName
        })

        myTeamsSlice.splice(existingTeamIndex, 1)
        myTeamsSlice.forEach(function(thisTeam){
            thisTeam.rank.myTeams = myTeamsSlice.findIndex(function(teams){ 
                return teams.teamName == thisTeam.teamName
            })
        })
        events.publish("myTeamsDataUpdated", myTeamsSlice) //send to DB for save
    }


})();

export{myTeamsModel}



