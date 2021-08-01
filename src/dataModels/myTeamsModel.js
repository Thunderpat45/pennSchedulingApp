import {events} from "../events"

/*
actions: loads user's teams' data from Mongo, updates data on each team's requests

publishes: 
    updated database myTeams info for:
        teamAdditions
        teamDeletions
        teamEdits
    teamData for teamRequestModel edit requests
    myTeam order rearrangements

subscribes to: 
    database myTeam loads/changes
        from: MongoDB
*/

const myTeamsModel = (function(){

    let myTeams; //should the below functions attempt immutability on this object?

    events.subscribe("editTeam", editTeam)
    events.subscribe("SOMETHINGABOUTTEAMORDER", modifyTeamOrder) //edit
    events.subscribe("SOMETHINGABOUTMONGODBUPDATE", loadMyTeams) //edit
    events.subscribe("workingModelValidated", addEditTeamForDatabaseUpdate)
    events.subscribe("SOMETHINGABOUTDELETE", deleteTeamForDatabaseUpdate)

    function loadMyTeams(MongoDBInfoOrLocalStorage){ //adjust params
         myTeams = Object.values(MongoDBInfoOrLocalStorage).sort(function(a,b){
             return a.rank.myTeams - b.rank.myTeams
         })
        events.publish("allTeamsLoaded", myTeams)
    }
    //all teams from DB on page load; subscribe?, window eventListener?; local storage to maintain data on DOM after refresh? move this question to allTeams

    function editTeam(teamRequest){
        const thisTeam = myTeams.filter(function(team){
            teamRequest == team
        })[0];
        events.publish("teamEditDataLoaded", thisTeam);
    }

    function modifyTeamOrder(teamIndex, modifier){
        const team = myTeams.splice(teamIndex, 1)[0];
        myTeams.splice(teamIndex + modifier, 0, team);
        myTeams.forEach(function(team){//check this
            team.rank.myTeams = myTeams.indexOf(team)
        })     
        events.publish("teamOrderModified", myTeams); //send to DB for save?
    }

    function addEditTeamForDatabaseUpdate(obj){
        let myTeamsSlice = myTeams.slice();
        const existingTeamIndex = findExistingTeam()
        
       if(existingTeamIndex != undefined){
            myTeamsSlice.splice(existingTeamIndex, 1, obj.workingModel)
       }else{
            myTeamsSlice.push(obj.workingModel)
       }
       myTeams.forEach(function(team){//check this
            team.rank.myTeams = myTeams.indexOf(team)
    })
        events.publish("myTeamsUpdateRequested", myTeamsSlice)

        function findExistingTeam(){
            myTeamsSlice.filter(function(team){
                if(obj.teamRequest.teamName == team.teamName){
                    return myTeamsSlice.indexOf(team)
                }
            })
        }
    }

    function deleteTeamForDatabaseUpdate(team){
        let myTeamsSlice = myTeams.slice();
        const existingTeamIndex = myTeamsSlice.indexOf(team)

        myTeamsSlice.splice(existingTeamIndex, 1)
        myTeams.forEach(function(team){//check this
        team.rank.myTeams = myTeams.indexOf(team)
    })
        events.publish("myTeamsUpdateRequested", myTeamsSlice)   
    }


})();

export{myTeamsModel}



