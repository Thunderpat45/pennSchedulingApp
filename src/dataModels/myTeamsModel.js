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

    let myTeams = [];

    events.subscribe("editTeam", editTeam)
    events.subscribe("SOMETHINGABOUTTEAMORDER", modifyTeamOrder) //edit
    events.subscribe("SOMETHINGABOUTMONGODBUPDATE", loadMyTeams) //edit

    function loadMyTeams(MongoDBInfoOrLocalStorage){ //adjust this
        myTeams = MongoDBInfoOrLocalStorage //copy
        events.publish("allTeamsLoaded", myTeams)
    }
    //all teams from DB on page load; subscribe?, window eventListener?; local storage to maintain data on DOM after refresh? move this question to allTeams

    function editTeam(teamRequest){
        const thisTeam = myTeams.filter(function(team){
            teamRequest == team
        })[0];
        events.publish("teamEditDataLoaded", thisTeam);
    }

    function modifyTeamOrder(teamIndex, modifier){ //myTeamIndex value on obj to remember order
        const team = myTeams.splice(teamIndex, 1)[0];
        myTeams.splice(teamIndex + modifier, 0, team);
        events.publish("teamOrderModified", myTeams); 
    }
})();

export{myTeamsModel}



