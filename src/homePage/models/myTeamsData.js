import {events} from "../../events"

const myTeamsModel = (function(){
   
    let myTeamsDataStable = [];
    let myTeamsDataMutable = [];

    events.subscribe('userDataFetched', setDataNewPageRender)
    events.subscribe('updateMyTeamsModel', setDataNewDatabasePost);
    events.subscribe("editTeamClicked", editTeam)
    events.subscribe("deleteTeamClicked", deleteTeam)
    events.subscribe('teamDataDeleted', setDataTeamDataDeleted)
   
    events.subscribe("verifyTeamClicked", verifyTeam)
    events.subscribe("teamVerificationSaved", setDataTeamDataVerified)
    events.subscribe('verifyAllTeamsClicked', verifyAllTeams);
    events.subscribe('updateAllTeamsModel', setDataNewDatabasePost)
    
    events.subscribe('teamOrderChangeClicked', sendTeamData)
    events.subscribe("modifyMyTeamsOrderClicked", modifyTeamOrder);
    events.subscribe('updateTeamOrderClicked', saveTeamOrderChanges);
    events.subscribe('cancelTeamOrderChangesClicked', cancelTeamOrderChanges);
    events.subscribe('myTeamsOrderChangeSaved', setDataNewTeamOrder)


    function setDataNewPageRender(userData){
        myTeamsDataStable = structuredClone(userData.myTeams);
        myTeamsDataMutable = structuredClone(myTeamsDataStable);
    }

    function editTeam(teamId){ 
        const thisTeam = myTeamsDataMutable.filter(function(team){
            return teamId == team._id
        })[0];
        events.publish("teamDataEditRequested", thisTeam);
    }

    function deleteTeam(teamId){
        events.publish("teamDataDeleteRequested", teamId) 
    }

    function verifyTeam(teamId){
        const thisTeam = structuredClone(myTeamsDataMutable.filter(function(team){
            return teamId == team._id
        })[0]);
        
        const now = new Date();
        const nowParsed = `${now.getMonth()+1}-${now.getDate()}-${now.getFullYear()}`
        thisTeam.lastVerified = nowParsed;

        events.publish("teamVerificationUpdateRequested", thisTeam) 
    }

    function verifyAllTeams(){
        const now = new Date();
        const nowParsed = `${now.getMonth()+1}-${now.getDate()}-${now.getFullYear()}`

        events.publish("userAllTeamsVerificationUpdateRequested", nowParsed)
    }
    

    function setDataNewDatabasePost(teamData){
		const thisTeamIndex = myTeamsDataMutable.findIndex(function(team){
			return team._id == teamData._id
		});
		if(thisTeamIndex != -1){
			myTeamsDataMutable[thisTeamIndex] = teamData
		}else{
			myTeamsDataMutable.push(teamData);
		}
		
        myTeamsDataStable = structuredClone(myTeamsDataMutable);
		events.publish("renderUpdatedMyTeamsData", myTeamsDataMutable)
    }

    function setDataTeamDataDeleted(_id){
		const newTeamsList = myTeamsDataMutable.filter(function(team){
			return _id != team._id
		})

		myTeamsDataMutable = newTeamsList;
		myTeamsDataStable = structuredClone(myTeamsDataMutable);
		events.publish("renderUpdatedMyTeamsData", myTeamsDataMutable)
	}

    function setDataTeamDataVerified(teamData){
        let thisTeam = myTeamsDataMutable.filter(function(team){
            return teamData._id == team._id
        })[0];

        for(let prop in teamData){
            thisTeam[prop] = teamData[prop]
        }

        events.publish("renderUpdatedMyTeamsData", myTeamsDataMutable)
    }

    function modifyTeamOrder(teamObj){
        const thisTeamIndex = myTeamsDataMutable.findIndex(function(team){
            return team._id == teamObj.team._id
        })
        
        const thisTeam = myTeamsDataMutable.splice(thisTeamIndex, 1)[0]

        myTeamsDataMutable.splice(thisTeamIndex + teamObj.modifier, 0, thisTeam);
        myTeamsDataMutable.forEach(function(thisTeam){
            thisTeam.rank.myTeams = myTeamsDataMutable.findIndex(function(teams){
                return teams._id == thisTeam._id
            })
        })     
        events.publish("teamsOrderDataUpdated", myTeamsDataMutable);
    }

    function sendTeamData(){
        events.publish('teamsOrderChangeRequested', myTeamsDataMutable)
    }

    function saveTeamOrderChanges(){
        events.publish('myTeamsOrderDataUpdateRequested', myTeamsDataMutable)
    }

    function cancelTeamOrderChanges(){
        myTeamsDataMutable = structuredClone(myTeamsDataStable);
        events.publish("teamDataChangesCancelled")
    }

    function setDataNewTeamOrder(){
        myTeamsDataStable = structuredClone(myTeamsDataMutable)
        events.publish('renderUpdatedMyTeamsData', myTeamsDataMutable)
    }

    

    


})();

export{myTeamsModel}



